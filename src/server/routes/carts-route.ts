import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { cartController } from '@/controllers/cart-controller';
import { createCartSchema } from '../schemas/carts-schema';

export const cartsRoute: FastifyPluginAsyncZod = async (fastifyServer) => {
	fastifyServer.post(
		'/',
		{
			schema: {
				tags: ['carts'],
				summary: 'Create a new cart',
				description: 'Create a new cart',
				body: createCartSchema,
			},
		},
		cartController.create,
	);
};
