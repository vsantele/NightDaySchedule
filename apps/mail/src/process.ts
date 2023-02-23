import { ParsedMail } from "mailparser";
import { validMail } from "./filter";
import { fromEmail, schedule } from "./parser";
import { prisma } from "./prisma";

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
					place,
					state,
				},
				create: {
					emailAddress,
					date,
					start,
					end,
					place,
					state,
				},
			});
		}),
	);
	console.log(`Processed ${emailAddress}`);
}

export { processMail };
