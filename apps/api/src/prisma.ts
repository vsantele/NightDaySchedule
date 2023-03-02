import { Place, prisma, Schedule } from "db";

export type ScheduleWithPlace = Schedule & { place: Place | null };

export async function getSchedule(
	email: string,
	dateStart: Date,
): Promise<ScheduleWithPlace[]> {
	return await prisma.schedule.findMany({
		where: {
			emailAddress: email,
			start: {
				gte: dateStart,
			},
		},
		include: {
			place: true,
		},
	});
}

export { prisma };
