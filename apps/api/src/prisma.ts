import { prisma, Schedule } from "db";

export async function getSchedule(
	email: string,
	dateStart: Date,
): Promise<Schedule[]> {
	return await prisma.schedule.findMany({
		where: {
			emailAddress: email,
			start: {
				gte: dateStart,
			},
		},
	});
}

export { prisma };
