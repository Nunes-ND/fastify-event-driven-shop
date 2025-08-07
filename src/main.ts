import { Application } from './application';
import { createDatabase, createPool } from './database';
import { fastifyServer } from './server';

async function bootstrap() {
	const pool = createPool();
	const db = createDatabase(pool);
	const app = new Application(fastifyServer, db, pool);
	await app.run();
}

bootstrap();
