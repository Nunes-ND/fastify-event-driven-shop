import type { CartItem } from '@/server/schemas/carts-schema';

export class CartItemModel {
	productId: string;
	quantity: number;
	priceSnapshot: number;

	constructor({ productId, quantity, priceSnapshot }: CartItem) {
		this.productId = productId;
		this.quantity = quantity;
		this.priceSnapshot = priceSnapshot;
	}
}
