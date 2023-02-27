import { Schedule } from "db";
import ical from "ical-generator";

export function calendar(days: Schedule[]) {
	const cal = ical();

	for (const day of days) {
		if (day.state === "WORK") {
			cal.createEvent({
				start: day.start,
				end: day.end,
				summary: day.place ?? "Error?",
				location: day.place,
			});
		}
	}

	return cal.toString();
}
