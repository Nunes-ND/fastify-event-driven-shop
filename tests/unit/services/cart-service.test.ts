import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { createCartItem } from 'tests/factories/cart-factory';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import type { dbSchemas } from '@/database/schemas';
import { cartItems } from '@/database/schemas/cart-item-schema';
import { carts } from '@/database/schemas/cart-schema';
import { eventService } from '@/event/event-service';
import { CartItemModel } from '@/models/cart-item-model';
import { CartModel } from '@/models/cart-model';
import { CartService } from '@/services/cart-service';

vi.mock('@/event/event-service', () => ({
	eventService: {
		emit: vi.fn(),
		on: vi.fn(),
	},
}));

describe('Cart Service', () => {
	let cartService: CartService;
	let db: NodePgDatabase<typeof dbSchemas>;

	beforeEach(() => {
		vi.clearAllMocks();
		db = {
			transaction: vi.fn(),
		} as unknown as NodePgDatabase<typeof dbSchemas>;

		cartService = CartService.getInstance(db);
	});

	it('should create a new cart, save it to the database, and emit an event', async () => {
		const cartData = { items: [createCartItem()] };
		const mockTx = {
			insert: vi.fn().mockReturnThis(),
			values: vi.fn(),
		};

		(db.transaction as Mock).mockImplementation(async (callback) =>
			callback(mockTx),
		);

		const cart = await cartService.createCart(cartData);

		expect(cart).toBeInstanceOf(CartModel);
		expect(cart).toEqual({
			id: expect.any(String),
			items: expect.arrayContaining([expect.any(CartItemModel)]),
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});

		expect(db.transaction).toHaveBeenCalledOnce();

		expect(mockTx.insert).toHaveBeenCalledWith(carts);
		expect(mockTx.values).toHaveBeenCalledWith(
			expect.objectContaining({
				id: cart.id,
			}),
		);

		expect(mockTx.insert).toHaveBeenCalledWith(cartItems);
		expect(mockTx.values).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cartId: cart.id,
					productId: cart.items[0].productId,
				}),
			]),
		);

		expect(eventService.emit).toHaveBeenCalledOnce();
		expect(eventService.emit).toHaveBeenCalledWith('CART_CREATED', {
			newCart: cart,
		});
	});
});
