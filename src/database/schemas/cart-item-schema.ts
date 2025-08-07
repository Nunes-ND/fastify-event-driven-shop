import { randomUUID } from 'node:crypto';
import { relations } from 'drizzle-orm';
import {
	integer,
	numeric,
	pgTable,
	primaryKey,
	text,
} from 'drizzle-orm/pg-core';
import { carts } from './cart-schema';

export const cartItems = pgTable(
	'cart_items',
	{
		id: text('id')
			.notNull()
			.$defaultFn(() => randomUUID()),
		productId: text('product_id').notNull(),
		quantity: integer('quantity').notNull(),
		priceSnapshot: numeric('price_snapshot', {
			precision: 10,
			scale: 2,
		}).notNull(),
		cartId: text('cart_id')
			.notNull()
			.references(() => carts.id),
	},
	(table) => {
		return [primaryKey({ columns: [table.id, table.cartId] })];
	},
);

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
	cart: one(carts, {
		fields: [cartItems.cartId],
		references: [carts.id],
	}),
}));
