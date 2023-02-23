const scheduleExtracted = (text: string) => {
	const lines = text.split("\n");
	let i = 0;
	while (
		i < lines.length &&
		!lines[i].includes("Voici ton horaire de la semaine.")
	) {
		i++;
	}
	let j = i;
	while (
		j < lines.length &&
		!lines[j].includes("Merci de confirmer l'horaire par retour de mail.")
	) {
		j++;
	}
	return lines.slice(i + 1, j).filter((l) => l.trim() !== "");
};

function scheduleObject(lines: string[]) {
	return lines.map((line) => {
		// extract date, time and location with regex from line like "Mardi 21/02/2023 de 20h15 à01h15 - Night 81 LLN 2" or "Lundi 20/02/2023 de Repos à -"
		const regex =
			/(\w+)\s(\d{2}\/\d{2}\/\d{4})\sde\s(\d{2}h\d{2}|Repos)\sà\s?(\d{2}h\d{2})?\s-\s?(.*)/;
		const res = line.match(regex);
		if (res === null) throw new Error("Invalid schedule");
		const [, day, date, from, to, place] = res;
		return {
			day,
			date,
			from,
			to,
			place,
		};
	});
}

function schedule(text: string) {
	const s = scheduleExtracted(text);
	if (s.length === 0) throw new Error("No schedule found");
	return scheduleObject(s);
}

export { schedule };

console.log(scheduleExtracted("test avec du vide"));
