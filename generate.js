const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { blahajDb } = require("./blahaj-db");

async function getStock(countryCode, languageCode, itemCode) {
	try {
		const stores = await axios({
			url: `https://www.ikea.com/${countryCode}/${languageCode}/meta-data/navigation/stores-detailed.json`,
		});

		const stock = await axios({
			url: `https://api.ingka.ikea.com/cia/availabilities/ru/${countryCode}`,
			headers: {
				Accept: "application/json;version=2",
				Referer: "https://www.ikea.com/",
				"X-Client-Id": "b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631",
			},
			params: {
				itemNos: itemCode,
				// expand: "StoresList,Restocks,SalesLocations",
				expand: "StoresList",
			},
		});

		return stock.data.availabilities
			.map(storeAvail => {
				const quantity =
					storeAvail?.buyingOption?.cashCarry?.availability?.quantity;
				if (quantity == null) return null;

				const storeId = storeAvail?.classUnitKey?.classUnitCode;
				const store = stores.data.find(store => store.id == storeId);
				if (store == null) return null;

				return {
					quantity,
					name: store.name,
					lat: store.lat,
					lng: store.lng,
				};
			})
			.filter(store => store != null);
	} catch (error) {
		console.error(countryCode + "-" + languageCode + " failed");
		return [];
	}
}

(async () => {
	const blahajRequestInfo = [
		...blahajDb.americas,
		...blahajDb.europe,
		...blahajDb.asia,
		...blahajDb.africa,
		...blahajDb.oceania,
	];

	const blahajStockResponse = await Promise.all(
		blahajRequestInfo.map(info => getStock(info[0], info[1], info[2])),
	);

	// flattens [[],[],[]] to a single array
	const blahajData = [].concat.apply([], blahajStockResponse);
	console.log(`Fetched data from ${blahajData.length} stores`);

	const publicPath = path.resolve(__dirname, "public");

	await fs.remove(publicPath);
	await fs.copy(path.resolve(__dirname, "html"), publicPath);
	await fs.writeJson(path.resolve(publicPath, "blahaj.json"), {
		updated: new Date().toISOString(),
		data: blahajData,
	});
})();
