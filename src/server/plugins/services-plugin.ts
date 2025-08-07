import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { CartService } from '@/services/cart-service';

async function servicesPlugin(fastify: FastifyInstance) {
	const cartService = CartService.getInstance(fastify.db);
	fastify.decorate('cartService', cartService);

	fastify.log.info('Services initialized');
}

export default fp(servicesPlugin);
