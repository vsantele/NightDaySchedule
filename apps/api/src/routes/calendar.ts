import { FastifyInstance } from "fastify";
import { calendar } from "../calendar";
import { getSchedule } from "../prisma";

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

async function routes(fastify: FastifyInstance, options: Object) {
	fastify.get<{ Querystring: IQueryString }>(
		"/",
		{
			schema: {
				querystring: querySchema,
			},
		},
		async (request, reply) => {
			try {
				const queryValidationFunction =
					request.compileValidationSchema(querySchema);
				const validationResult = queryValidationFunction(request.query);
				if (validationResult !== true) {
					reply.status(400);
					return validationResult;
				}
				const date = new Date(request.query.from ?? new Date("2023-01-01"));
				reply.type("text/caledar");
				const schedule = await getSchedule(request.query.email, date);
				if (schedule.length === 0) {
					reply.status(404);
					return { error: "User not found" };
				}
				return calendar(schedule);
			} catch (error) {
				reply.status(500);
				return { error: "Internal Server Error" };
			}
		},
	);
}

export default routes;
