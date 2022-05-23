import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { generateBlahajData } from "./generate.mjs";
import { CronJob } from "cron";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "public");
const blahajDataPath = path.resolve(publicDir, "blahaj.json");

const app = express();

async function updateBlahajData() {
	const blahajData = await generateBlahajData();
	await fs.writeFile(blahajDataPath, JSON.stringify(blahajData));
}

fs.pathExists(blahajDataPath).then(exists => {
	if (!exists) updateBlahajData();
});

new CronJob("0 * * * *", updateBlahajData, null, true);

app.use(express.static(publicDir));

app.listen(8080, () => {
	console.log("Server listening on http://127.0.0.1:8080");
});
