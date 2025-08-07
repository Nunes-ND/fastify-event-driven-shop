import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateCartRequest } from '@/server/schemas/carts-schema';

export class CartController {
	private static instance: CartController | null = null;

	private constructor() {}

	static getInstance() {
		if (!CartController.instance) {
			CartController.instance = new CartController();
		}
		return CartController.instance;
	}

	async create(
		request: FastifyRequest<CreateCartRequest>,
		reply: FastifyReply,
	) {
		const cart = await request.server.cartService.createCart({
			items: request.body.cartItems,
		});
		reply.status(201).send({
			data: {
				id: cart.id,
				items: cart.items,
				createdAt: cart.createdAt,
				updatedAt: cart.updatedAt,
			},
		});
	}
}

export const cartController = CartController.getInstance();
