import { z } from 'zod';

export const cartItemSchema = z.object({
	productId: z.string(),
	quantity: z.number().min(1),
	priceSnapshot: z.number(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const createCartSchema = z.object({
	cartItems: z.array(cartItemSchema),
});

export type CreateCartRequest = { Body: z.infer<typeof createCartSchema> };
