import { randomUUID } from 'node:crypto';
import { CartItemModel } from '@/models/cart-item-model';
import { CartModel } from '@/models/cart-model';
import type { CartItem } from '@/server/schemas/carts-schema';

export function createItems(count = 1) {
	const items: CartItem[] = [];
	for (let i = 1; i <= count; i++) {
		const newItem = {
			productId: randomUUID(),
			quantity: 1,
			priceSnapshot: 99.99,
		};
		items.push(newItem);
	}
	return items;
}

export function createCartItem(): CartItemModel {
	const cartItems = createItems(1);
	const cartItem = new CartItemModel(cartItems[0]);
	return cartItem;
}

export function createCartItems(count = 1): CartItemModel[] {
	const items: CartItemModel[] = [];
	for (let i = 1; i <= count; i++) {
		const cartItem = createCartItem();
		items.push(cartItem);
	}
	return items;
}

export function createCart(items: CartItemModel[] = createCartItems()) {
	return new CartModel(items);
}
