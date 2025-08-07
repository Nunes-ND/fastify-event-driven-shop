import type { Pool } from 'pg';
import type { getDB } from '../database';

declare module 'fastify' {
	export interface FastifyInstance {
		db: ReturnType<typeof getDB>;
		pool: Pool;
		start: () => Promise<void>;
		shutdown: () => Promise<void>;
	}
}
