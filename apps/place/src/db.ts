import { Place, prisma } from "db";

export async function insertPlaces(places: Place[]): Promise<void> {
	try {
		await prisma.place.createMany({
			data: places,
			skipDuplicates: true,
		});
	} catch (e) {
		throw new Error(`Failed to insert places: ${e}`);
	}
}
