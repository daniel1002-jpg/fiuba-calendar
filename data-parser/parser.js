const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "raw-data.txt");
const outputPath = path.join(__dirname, "output.json");

const monthMap = {
	Enero: 1,
	Febrero: 2,
	Marzo: 3,
	Abril: 4,
	Mayo: 5,
	Junio: 6,
	Julio: 7,
	Agosto: 8,
	Septiembre: 9,
	Octubre: 10,
	Noviembre: 11,
	Diciembre: 12,
};

const toIsoDateUtc = (year, month, day) => {
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.toISOString().slice(0, 10);
};

const addDaysUtc = (isoDate, daysToAdd) => {
	const [year, month, day] = isoDate.split("-").map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	date.setUTCDate(date.getUTCDate() + daysToAdd);
	return date.toISOString().slice(0, 10);
};

const normalize = (text) => text.toLowerCase();

const getCategory = (title) => {
	const normalized = normalize(title);
	if (normalized.includes("evaluaciones")) {
		return "EXAMEN";
	}
	if (normalized.includes("inscripción") || normalized.includes("desincripción")) {
		return "ADMINISTRATIVO";
	}
	return "ACADEMICO";
};

const rawText = fs.readFileSync(inputPath, "utf8");
const lines = rawText
	.split(/\r?\n/)
	.map((line) => line.trim())
	.filter(Boolean);

const events = [];

for (const line of lines) {
	const match = line.match(/^(.+?):\s*(.+)$/);
	if (!match) {
		continue;
	}

	const title = match[1].trim();
	const monthSegments = match[2];
	const category = getCategory(title);

	const monthRegex = /([A-Za-zÁÉÍÓÚáéíóúñÑ]+)\s*\[([^\]]+)\]/g;
	let monthMatch;
	while ((monthMatch = monthRegex.exec(monthSegments)) !== null) {
		const monthName = monthMatch[1].trim();
		const daysRaw = monthMatch[2];
		const monthNumber = monthMap[monthName];

		if (!monthNumber) {
			continue;
		}

		const days = daysRaw
			.split(",")
			.map((day) => day.trim())
			.filter(Boolean)
			.map(Number)
			.filter((day) => Number.isInteger(day));

		for (const day of days) {
			const startDate = toIsoDateUtc(2026, monthNumber, day);
			const endDate = addDaysUtc(startDate, 5);

			events.push({
				title,
				start_date: startDate,
				end_date: endDate,
				category,
			});
		}
	}
}

fs.writeFileSync(outputPath, JSON.stringify(events, null, 2) + "\n", "utf8");

console.log(`Generated ${events.length} events -> ${outputPath}`);
