import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { cartItems } from './cart-item-schema';

export const carts = pgTable('carts', {
	id: text('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cartsRelations = relations(carts, ({ many }) => ({
	items: many(cartItems),
}));
