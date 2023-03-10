import { ParsedMail } from "mailparser";
import { validMail } from "./filter.js";
import logger from "./logger.js";
import { fromEmail, schedule } from "./parser.js";
import { prisma } from "./prisma.js";

async function processMail(email: ParsedMail) {
	if (!validMail(email) || email.text === undefined) {
		return;
	}

	const emailAddress = fromEmail(email);
	if (emailAddress === undefined) return;

	const calendar = schedule(email.text);

	await Promise.all(
		calendar.map(async ({ date, start, end, place, state }) => {
			await prisma.schedule.upsert({
				where: {
					emailAddress_date: {
						date: date,
						emailAddress,
					},
				},
				update: {
					start,
					end,
					placeName: place,
					state,
				},
				create: {
					emailAddress,
					date,
					start,
					end,
					placeName: place,
					state,
				},
			});
		}),
	);
	logger.info(`Processed ${emailAddress}`);
}

export { processMail };
