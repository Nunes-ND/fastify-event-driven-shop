import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

async function swaggerPlugin(fastify: FastifyInstance) {
	if (process.env.NODE_ENV === 'development') {
		fastify.register(fastifySwagger, {
			openapi: {
				info: {
					title: 'Fastify Event Driven Shop',
					description: 'Sample swagger documentation',
					version: '0.1.0',
				},
				servers: [{ url: String(process.env.SWAGGER_SERVER_URL) }],
			},
			transform: jsonSchemaTransform,
		});

		fastify.register(fastifySwaggerUI, {
			routePrefix: '/documentation',
			uiConfig: {
				docExpansion: 'list',
				deepLinking: false,
			},
			staticCSP: true,
			transformSpecificationClone: true,
		});

		fastify.log.info('Swagger documentation enabled at /documentation');
	}
}

export default fp(swaggerPlugin);
