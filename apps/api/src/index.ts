import fastify from "fastify";
import calendarRoutes from "./routes/calendar";

type Environment = "development" | "production" | "test";

const envToLogger: {
	[K in Environment]: boolean | Object;
} = {
	development: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
			},
		},
	},
	production: {
		level: "info",
		file: "/var/logs/api.log",
	},
	test: false,
};

const environment = process.env.NODE_ENV ?? "development";

const server = fastify({
	logger: envToLogger[environment as Environment] ?? true,
});

server.register(calendarRoutes, { prefix: "/calendar" });

server.listen({ port: 5173, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
