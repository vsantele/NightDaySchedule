import { load as CherrioLoad } from "cheerio";

export default function parser(
	html: string,
): { name: string; address: string }[] {
	const $ = CherrioLoad(html);

	const shops = $(".shop-list").children("a.shop");
	return shops
		.map((i, el) => {
			const name = $(el).find(".shop-title").text();
			const address = $(el).find(".shop-address").text();
			return { name, address };
		})
		.toArray();
}
