import ical from "ical-generator";
import { ScheduleWithPlace } from "./prisma";

export function calendar(days: ScheduleWithPlace[]) {
	const cal = ical();

	for (const day of days) {
		if (day.state === "WORK") {
			cal.createEvent({
				start: day.start,
				end: day.end,
				summary: day.place?.name ?? "Error?",
				location: day.place?.address ?? day.placeName ?? "Error?",
			});
		}
	}

	return cal.toString();
}
