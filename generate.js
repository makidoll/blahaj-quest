const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

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
	const blahajData = [
		// north america
		...(await getStock("us", "en", "90373590")),
		...(await getStock("ca", "en", "90373590")),
		// south america
		...(await getStock("mx", "es", "90373590")),
		// europe
		...(await getStock("es", "es", "30373588")),
		...(await getStock("gb", "en", "30373588")),
		...(await getStock("fr", "fr", "30373588")),
		...(await getStock("be", "nl", "30373588")),
		...(await getStock("nl", "nl", "30373588")),
		...(await getStock("de", "de", "30373588")),
		...(await getStock("it", "it", "30373588")),
	];

	const publicPath = path.resolve(__dirname, "public");

	await fs.remove(publicPath);
	await fs.copy(path.resolve(__dirname, "html"), publicPath);
	await fs.writeJson(path.resolve(publicPath, "blahaj.json"), {
		updated: new Date().toISOString(),
		data: blahajData,
	});
})();
