import fastify from "fastify";
import calendarRoutes from "./routes/calendar";
const server = fastify({ logger: true });

server.register(calendarRoutes, { prefix: "/calendar" });

server.listen({ port: 8081, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
