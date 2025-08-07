import { randomUUID } from 'node:crypto';
import type { CartItemModel } from './cart-item-model';

export class CartModel {
	id: string;
	items: CartItemModel[];
	createdAt: Date;
	updatedAt: Date;

	constructor(items: CartItemModel[]) {
		this.id = randomUUID();
		this.items = items;
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}
