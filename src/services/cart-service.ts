import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { dbSchemas } from '@/database/schemas';
import { cartItems } from '@/database/schemas/cart-item-schema';
import { carts } from '@/database/schemas/cart-schema';
import { eventService } from '@/event/event-service';
import { CartItemModel } from '@/models/cart-item-model';
import { CartModel } from '@/models/cart-model';
import type { CartItem } from '@/server/schemas/carts-schema';

export class CartService {
	private static instance: CartService | null = null;
	private db: NodePgDatabase<typeof dbSchemas>;

	constructor(db: NodePgDatabase<typeof dbSchemas>) {
		this.db = db;
		eventService.on('CART_CREATED', () => this.createCart);
	}

	static getInstance(db: NodePgDatabase<typeof dbSchemas>) {
		if (!CartService.instance) {
			CartService.instance = new CartService(db);
		}
		return CartService.instance;
	}

	async createCart(cartData: { items: CartItem[] }) {
		const items = this.handleCreateCartItems(cartData.items);
		const newCart = new CartModel(items);

		await this.db.transaction(async (tx) => {
			await tx.insert(carts).values({
				id: newCart.id,
				createdAt: newCart.createdAt,
				updatedAt: newCart.updatedAt,
			});

			if (newCart.items.length > 0) {
				const itemsToInsert = newCart.items.map((item) => ({
					...item,
					priceSnapshot: item.priceSnapshot.toString(),
					cartId: newCart.id,
				}));
				await tx.insert(cartItems).values(itemsToInsert);
			}
		});

		eventService.emit('CART_CREATED', { newCart });
		return newCart;
	}

	private handleCreateCartItems(cartItemsData: CartItem[]) {
		const items = cartItemsData.map((item) => new CartItemModel(item));
		return items;
	}
}
