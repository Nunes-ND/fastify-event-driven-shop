import { createCartItem } from 'tests/factories/cart-factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartController } from '@/controllers/cart-controller';
import type {
	CartItem,
	CreateCartRequest,
} from '@/server/schemas/carts-schema';
import { setupMockFastify } from '../../utils/mock-fastify';

const mockCartService = {
	createCart: vi.fn(),
};

describe('Cart Controller', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create a cart and return it', async () => {
		const cartItemsPayload: CartItem[] = createCartItem({ quantity: 2 });

		const createdCart = {
			id: 'cart-id-123',
			items: cartItemsPayload,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		mockCartService.createCart.mockResolvedValue(createdCart);

		type Services = {
			cartService: typeof mockCartService;
		};

		const { mockRequest, mockReply } = setupMockFastify<
			Services,
			CreateCartRequest
		>({
			cartService: mockCartService,
		});

		mockRequest.body = {
			cartItems: cartItemsPayload,
		};

		const controller = CartController.getInstance();
		await controller.create(mockRequest, mockReply);

		expect(mockCartService.createCart).toHaveBeenCalledTimes(1);
		expect(mockCartService.createCart).toHaveBeenCalledWith({
			items: cartItemsPayload,
		});

		expect(mockReply.status).toHaveBeenCalledWith(201);
		expect(mockReply.send).toHaveBeenCalledWith({
			data: {
				id: createdCart.id,
				items: createdCart.items,
				createdAt: createdCart.createdAt,
				updatedAt: createdCart.updatedAt,
			},
		});
	});
});
