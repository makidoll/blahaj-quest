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
	// TODO: use this https://en.wikipedia.org/wiki/List_of_countries_with_IKEA_stores

	const blahajAmericasData = [
		// north america
		...(await getStock("us", "en", "90373590")),
		...(await getStock("ca", "en", "90373590")),
		// south america
		...(await getStock("mx", "es", "90373590")),
	];

	const blahajEuropeData = [
		// https://www.worldometers.info/geography/how-many-countries-in-europe/
		...(await getStock("ru", "ru", "30373588")), // russia
		...(await getStock("de", "de", "30373588")), // germany
		...(await getStock("gb", "en", "30373588")), // united kingdom
		...(await getStock("fr", "fr", "30373588")), // france
		...(await getStock("it", "it", "30373588")), // italy
		...(await getStock("es", "es", "30373588")), // spain
		...(await getStock("ua", "uk", "30373588")), // ukraine
		...(await getStock("pl", "pl", "30373588")), // poland
		...(await getStock("ro", "ro", "30373588")), // romania
		...(await getStock("nl", "nl", "30373588")), // netherlands
		...(await getStock("be", "nl", "30373588")), // belgium
		...(await getStock("cz", "cs", "30373588")), // czech republic
		// greece has a different api
		...(await getStock("pt", "pt", "30373588")), // portugal
		...(await getStock("se", "sv", "30373588")), // sweden
		...(await getStock("hu", "hu", "30373588")), // hungary
		// belarus has no ikea
		...(await getStock("at", "de", "30373588")), // austria
		...(await getStock("rs", "sr", "30373588")), // serbia
		...(await getStock("ch", "en", "30373588")), // switzerland
		// bulgaria has a different api
		...(await getStock("dk", "da", "30373588")), // denmark
		...(await getStock("fi", "fi", "30373588")), // finland
		...(await getStock("sk", "sk", "30373588")), // slovakia
		...(await getStock("no", "no", "30373588")), // norway
		...(await getStock("ie", "en", "30373588")), // ireland
		...(await getStock("hr", "hr", "30373588")), // croatia
		// moldava has like fake ikea what
		// lithuania has a different api
		// north macedonia has no ikea
		...(await getStock("si", "sl", "30373588")), // slovenia
		// latvia has a different api
		// montenegro has another fake ikea
		// luxemberg has no ikea yet, until 2025
		// iceland has a different api
		// andora has no ikea
		// monaco has no ikea
		// liechtenstein has no ikea
		// san marino has no ikea
		// holy see has no ikea
	];

	const blahajData = [...blahajAmericasData, ...blahajEuropeData];

	const publicPath = path.resolve(__dirname, "public");

	await fs.remove(publicPath);
	await fs.copy(path.resolve(__dirname, "html"), publicPath);
	await fs.writeJson(path.resolve(publicPath, "blahaj.json"), {
		updated: new Date().toISOString(),
		data: blahajData,
	});
})();
