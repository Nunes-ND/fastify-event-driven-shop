import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { dbSchemas } from './schemas';

export function createPool(): Pool {
	return new Pool({
		connectionString: process.env.DATABASE_URL,
		max: 20,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
	});
}

export function createDatabase(pool: Pool): NodePgDatabase<typeof dbSchemas> {
	return drizzle(pool, { schema: dbSchemas });
}
