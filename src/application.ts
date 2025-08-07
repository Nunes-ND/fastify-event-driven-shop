import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { FastifyInstance } from 'fastify';
import type { Pool } from 'pg';
import type { dbSchemas } from './database/schemas';
import lifecyclePlugin from './server/plugins/lifecycle-plugin';

export class Application {
	private server: FastifyInstance;
	private db: NodePgDatabase<typeof dbSchemas>;
	private pool: Pool;

	constructor(
		fastifyServer: FastifyInstance,
		db: NodePgDatabase<typeof dbSchemas>,
		pool: Pool,
	) {
		this.server = fastifyServer;
		this.db = db;
		this.pool = pool;
	}

	async run() {
		await this.initializeDependencies();
		await this.server.start();
	}

	async initializeDependencies() {
		try {
			this.server.log.info('Initializing dependencies...');

			this.server.log.info('Connecting to database...');
			const client = await this.pool.connect();
			this.server.log.info('Database connected successfully.');
			client.release();

			this.server.decorate('db', this.db);
			this.server.decorate('pool', this.pool);
			this.server.log.info('Server instance decorated.');

			await this.server.register(lifecyclePlugin, { pool: this.pool });
			this.server.log.info('Server plugin registered.');

			this.server.log.info('Dependencies initialized successfully.');
		} catch (error) {
			this.server.log.error('Failed to initialize dependencies:', error);
			throw error;
		}
	}
}
