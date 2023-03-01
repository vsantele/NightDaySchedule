import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const transport = pino.transport({
	targets: [
		{
			level: "info",
			target: "pino/file",
			options: {
				destination: isProd
					? "/var/logs/mail/mail.log"
					: `${process.env.TMP}night.log`,
			},
		},
		{
			level: isProd ? "info" : "debug",
			target: isProd ? "pino/file" : "pino-pretty",
			options: { destination: undefined },
		},
	],
});

const logger = pino(
	{
		level: "debug",
	},
	transport,
);

export default logger;
