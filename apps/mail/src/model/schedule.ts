export default interface schedule {
	day: string;
	date: Date;
	start: Date | null;
	end: Date | null;
	place: string | null;
	state: "WORK" | "REST";
}
