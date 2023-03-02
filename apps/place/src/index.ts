import { insertPlaces } from "./db";
import parser from "./parser";

async function main() {
	const url = process.env.PLACE_ADDRESS;
	if (url === undefined) {
		throw new Error("PLACE_ADDRESS is not defined");
	}

	const res = await fetch(url);
	if (res.ok) {
		const html = await res.text();
		const nights = parser(html);
		await insertPlaces(nights);
		console.log(`Inserted ${nights.length} places`);
	} else {
		throw new Error(`Failed to fetch: ${url}`);
	}
}

main().catch((e) => {
	console.error(e);
});
