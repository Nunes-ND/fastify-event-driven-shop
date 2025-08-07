import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { createItems } from 'tests/factories/cart-factory';
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	type Mock,
	vi,
} from 'vitest';
import type { dbSchemas } from '@/database/schemas';
import { eventService } from '@/event/event-service';
import { fastifyServer } from '@/server';

vi.mock('@/event/event-service', () => ({
	eventService: {
		emit: vi.fn(),
		on: vi.fn(),
	},
}));

const mockDb = {
	transaction: vi.fn(),
} as unknown as NodePgDatabase<typeof dbSchemas>;

describe('Carts Route', () => {
	beforeAll(async () => {
		fastifyServer.decorate('db', mockDb);
		await fastifyServer.ready();
	});

	afterAll(async () => {
		await fastifyServer.close();
	});

	beforeEach(() => {
		vi.clearAllMocks();
		(mockDb.transaction as Mock).mockClear();
	});

	it('should create a new cart, save it, emit an event and return status 201', async () => {
		const cartItems = createItems(2);

		const mockTx = {
			insert: vi.fn().mockReturnThis(),
			values: vi.fn(),
		};
		(mockDb.transaction as Mock).mockImplementation(async (callback) =>
			callback(mockTx),
		);

		const response = await fastifyServer.inject({
			method: 'POST',
			url: '/carts',
			body: { cartItems },
		});

		expect(response.statusCode).toBe(201);
		expect(mockDb.transaction).toHaveBeenCalledOnce();
		expect(eventService.emit).toHaveBeenCalledOnce();
		expect(eventService.emit).toHaveBeenCalledWith(
			'CART_CREATED',
			expect.objectContaining({
				newCart: expect.objectContaining({
					items: expect.any(Array),
				}),
			}),
		);
	});

	it('should return status 400 if payload is invalid', async () => {
		const invalidPayload = {};

		const response = await fastifyServer.inject({
			method: 'POST',
			url: '/carts',
			body: invalidPayload,
		});

		expect(response.statusCode).toBe(400);
		expect(mockDb.transaction).not.toHaveBeenCalled();
		expect(eventService.emit).not.toHaveBeenCalled();
	});
});
