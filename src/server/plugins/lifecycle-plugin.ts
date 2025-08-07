import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { Pool } from 'pg';

const PORT = Number(process.env.PORT) || 8080;
const HOST = '0.0.0.0';

export interface LifecyclePluginOptions {
	pool: Pool;
}

async function lifecyclePlugin(
	fastify: FastifyInstance,
	options: LifecyclePluginOptions,
) {
	const { pool } = options;

	fastify.decorate('start', async function (this: FastifyInstance) {
		try {
			await this.listen({ port: PORT, host: HOST });
			if (process.env.NODE_ENV === 'development') {
				this.log.info(this.printRoutes({ commonPrefix: false }));
			}
			registerShutdownHandlers(this);
		} catch (error) {
			this.log.error('Failed to start server:', error);
			process.exit(1);
		}
	});

	fastify.decorate('shutdown', async function (this: FastifyInstance) {
		fastify.log.info('Shutting down gracefully...');
		await fastify.close();
		fastify.log.info('Server closed.');

		fastify.log.info('Closing database pool...');
		await pool.end();
		fastify.log.info('Database pool closed.');
	});
}

function registerShutdownHandlers(fastify: FastifyInstance) {
	const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
	for (const signal of signals) {
		process.on(signal, async () => {
			try {
				fastify.log.info(`Received ${signal}, initiating shutdown...`);
				await fastify.shutdown();
				fastify.log.info('Shutdown complete.');
				process.exit(0);
			} catch (error) {
				fastify.log.error('Error during shutdown:', error);
				process.exit(1);
			}
		});
	}
}

export default fp(lifecyclePlugin);
