const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");

const getStoresAndAvailability = () =>
	new Promise(async (resolve, reject) => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		let finished = false;
		let stores = null;
		let availability = null;

		const tryFinish = () => {
			if (stores != null && availability != null) {
				finished = true;
				resolve({
					stores: JSON.parse(stores),
					availability: JSON.parse(availability),
				});
			}
		};

		page.on("response", async res => {
			if (finished) return;
			const url = new URL(res.url());
			if (url.pathname.endsWith("stores-detailed.json")) {
				stores = (await res.buffer()).toString("utf8");
				tryFinish();
			} else if (url.pathname.includes("/availabilities/")) {
				if (res.request().method() != "GET") return;
				if (url.searchParams.get("zip") != null) return;
				availability = (await res.buffer()).toString("utf8");
				tryFinish();
			}
		});

		await page.goto(
			"https://www.ikea.com/us/en/p/blahaj-soft-toy-shark-90373590/",
			{
				waitUntil: "networkidle2",
			},
		);

		await browser.close();
	});

(async () => {
	const { stores, availability } = await getStoresAndAvailability();

	const blahajData = availability.availabilities
		.map(item => {
			const quantity =
				item.buyingOption?.cashCarry?.availability?.quantity;
			if (quantity == null) return null;

			const storeId = parseInt(item.classUnitKey?.classUnitCode);
			if (Number.isNaN(storeId)) return null;

			const store = stores.find(store => store.id == storeId);
			if (store == null) return null;

			return {
				quantity,
				name: store.name,
				lat: parseInt(store.lat),
				lng: parseInt(store.lng),
			};
		})
		.filter(store => store != null);

	const publicPath = path.resolve(__dirname, "public");

	await fs.remove(publicPath);
	await fs.copy(path.resolve(__dirname, "html"), publicPath);
	await fs.writeJson(path.resolve(publicPath, "blahaj.json"), {
		updated: new Date().toISOString(),
		data: blahajData,
	});
})();
