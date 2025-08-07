import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';
import type { dbSchemas } from '@/database/schemas';
import type { CartService } from '@/services/cart-service';

declare module 'fastify' {
	export interface FastifyInstance {
		db: NodePgDatabase<typeof dbSchemas>;
		pool: Pool;
		cartService: CartService;
		start: () => Promise<void>;
		shutdown: () => Promise<void>;
	}
}
