import { ParsedMail } from "mailparser";
import Schedule from "./model/schedule.js";

function schedule(text: string): Schedule[] {
	return text
		.split("\n")
		.map((line) => {
			// extract date, time and location with regex from line like "Mardi 21/02/2023 de 20h15 à01h15 - Night 81 LLN 2" or "Lundi 20/02/2023 de Repos à -"
			const regex =
				/(\w+)\s(\d{2}\/\d{2}\/\d{4})\sde\s(\d{2}h\d{2}|Repos)\sà\s?(\d{2}h\d{2})?\s-\s?(.*)/;
			const res = line.match(regex);
			if (res === null) return null;

			const [, day, dateStr, from, to, placeAll] = res;
			const state = from === "Repos" ? "REST" : "WORK";
			const date = convertDate(dateStr);
			const place = placeAll.replace(/Night \d+\s/, "").trim();

			if (state === "REST") {
				return { day, date, start: null, end: null, place: null, state };
			}

			const { start, end } = convertTime(from, to, date);

			return {
				day,
				date,
				start,
				end,
				place,
				state,
			};
		})
		.filter((s) => s !== null) as Schedule[];
}

function convertDate(date: string): Date {
	const [day, month, year] = date.split("/");
	return new Date(`${year}-${month}-${day}`);
}

function convertTime(
	start: string,
	end: string,
	date: Date,
): { start: Date; end: Date } {
	const [hourStart, minuteStart] = start.split("h").map((n) => parseInt(n, 10));
	const [hourEnd, minuteEnd] = end.split("h").map((n) => parseInt(n, 10));

	const dateStart = new Date(date);
	dateStart.setHours(hourStart);
	dateStart.setMinutes(minuteStart);

	const dateEnd = new Date(date);
	if (hourStart > hourEnd) {
		dateEnd.setDate(dateEnd.getDate() + 1);
	}
	dateEnd.setHours(hourEnd);
	dateEnd.setMinutes(minuteEnd);
	return { start: dateStart, end: dateEnd };
}

function fromEmail(mail: ParsedMail) {
	return mail.from?.value[0].address;
}

export { schedule, fromEmail };
