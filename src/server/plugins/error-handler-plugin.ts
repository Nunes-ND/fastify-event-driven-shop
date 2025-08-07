import type {
	FastifyError,
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
} from 'fastify';

export function errorHandler(fastify: FastifyInstance) {
	fastify.setErrorHandler(
		(error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
			fastify.log.error(error);
			if (error.validation) {
				return reply.status(400).send({
					statusCode: 400,
					error: 'Bad Request',
					message: 'Data Validation Error.',
					details: error.validation,
				});
			}

			const statusCode = error.statusCode || 500;
			const message =
				statusCode < 500 || process.env.NODE_ENV !== 'production'
					? error.message
					: 'An unexpected error occurred.';

			return reply.status(statusCode).send({
				statusCode,
				error: error.name || 'Internal Server Error',
				message,
			});
		},
	);
}
