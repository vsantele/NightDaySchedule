import pino from "pino";

export default function getLogger(app: string) {
	const isProd = process.env.NODE_ENV === "production";

	const transport = pino.transport({
		targets: [
			{
				level: "info",
				target: "pino/file",
				options: {
					destination: isProd
						? `/var/logs/${app}/${app}.log`
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

	return logger;
}
