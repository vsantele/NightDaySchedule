import fastify from "fastify";
import { calendar } from "./calendar";
import { getSchedule } from "./prisma";

const server = fastify();

interface IQueryString {
	email: string;
	from?: string;
}

const querySchema = {
	type: "object",
	properties: {
		email: { type: "string" },
		from: { type: "string" },
	},
	required: ["email"],
};

server.get<{ Querystring: IQueryString }>(
	"/calendar",
	{
		schema: {
			querystring: querySchema,
		},
	},
	async (request, reply) => {
		const queryValidationFunction =
			request.compileValidationSchema(querySchema);
		const validationResult = queryValidationFunction(request.query);
		if (validationResult !== true) {
			reply.status(400);
			return validationResult;
		}
		const date = new Date(request.query.from ?? new Date("2023-01-01"));
		reply.type("text/caledar");
		return calendar(await getSchedule(request.query.email, date));
	},
);

server.listen({ port: 8081, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
