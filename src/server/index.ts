import fastifyCors from '@fastify/cors';
import Fastify from 'fastify';
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { loggerConfig } from './configs/logger';
import { errorHandler } from './plugins/error-handler-plugin';
import servicesPlugin from './plugins/services-plugin';
import swaggerPlugin from './plugins/swagger-plugin';
import { cartsRoute } from './routes/carts-route';

export const fastifyServer = Fastify({
	logger: loggerConfig,
}).withTypeProvider<ZodTypeProvider>();

fastifyServer.setValidatorCompiler(validatorCompiler);
fastifyServer.setSerializerCompiler(serializerCompiler);

fastifyServer.register(fastifyCors, {
	origin: process.env.CORS_ORIGIN,
});

fastifyServer.register(swaggerPlugin);

fastifyServer.register(servicesPlugin);

fastifyServer.register(cartsRoute, { prefix: '/carts' });

fastifyServer.register(errorHandler);
