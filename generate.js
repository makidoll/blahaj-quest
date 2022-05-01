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
	const blahajAmericasData = [
		// north america
		...(await getStock("us", "en", "90373590")),
		...(await getStock("ca", "en", "90373590")),
		// south america
		...(await getStock("mx", "es", "90373590")),
		// dominica, regional site
		// pureto rico, regional site
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

	const blahajAsiaData = [
		// afghanistan -
		// armenia -
		// azerbaijan -
		...(await getStock("bh","ar","30373588")), // bahrain
		// bangladesh -
		// bhutan -
		// brunei -
		// burma/myanmar -
		// cambodia -
		...(await getStock("cn","zh","10373589")), // china, redirected to local site, but same api
		// taiwan, regional site
		// hongkong and macau, regional site
		// cyprus, different api?
		// georgia -
		...(await getStock("in","en","10373589")), // india
		// indonesia, regional? site
		// iran -
		// iraq -
		...(await getStock("il","he","30373588")), // israel
		...(await getStock("jp","ja","10373589")), // japan
		...(await getStock("jo","ar","30373588")), // jordan
		// kazakhstan -
		...(await getStock("kw","ar","30373588")), // kuwait
		// kyrgyzstan -
		// laos -
		// lebanon -
		...(await getStock("my","ms","10373589")), // malaysia
		// maldives -
		// mongolia -
		// nepal -
		// north korea -
		// oman 2022
		// pakistan -
		// palestine -
		...(await getStock("ph","en","10373589")), // philippines
		...(await getStock("qa","ar","30373588")), // qatar
		...(await getStock("sa","ar","30373588")), // saudi arabia
		...(await getStock("sg","en","10373589")), // singapore
		...(await getStock("kr","ko","10373589")), // south korea
		// sri lanka -
		// syria -
		// tajikstan -
		...(await getStock("th","th","10373589")), // thailand
		// east timor -
		// turkey, regional? site
		// turkmenistan -
		...(await getStock("ae","ar","30373588")), // united arab emirates 
		// uzbekistan -
		// vietnam 2025
		// yemen -
	]

	const blahajAfricaData = [
		...(await getStock("eg","ar","30373588")), // egypt
		...(await getStock("eg","ar","30373588")), // morocco
		// only 2 country as of 2022-05-01
	]

	const blahajOceaniaData = [
		...(await getStock("au","en","10373589")), // australia
		// new zealand, 2022
		// only 1 country and 1 planned as of 2022-05-01
	]

	const blahajData = [...blahajAmericasData, ...blahajEuropeData, ...blahajAsiaData, ...blahajAfricaData, ...blahajOceaniaData];

	const publicPath = path.resolve(__dirname, "public");

	await fs.remove(publicPath);
	await fs.copy(path.resolve(__dirname, "html"), publicPath);
	await fs.writeJson(path.resolve(publicPath, "blahaj.json"), {
		updated: new Date().toISOString(),
		data: blahajData,
	});
})();
