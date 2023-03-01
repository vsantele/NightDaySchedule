import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const filePipeline = {
	level: "info",
	target: "pino/file",
	options: { destination: "/var/logs/mail/mail.log" },
};
const consolePipeline = {
	target: isProd ? "pino/file" : "pino-pretty",
};

const transport = pino.transport({
	pipeline: isProd ? [filePipeline, consolePipeline] : [consolePipeline],
});

const logger = pino(
	{
		level: "debug",
	},
	transport,
);

export default logger;
