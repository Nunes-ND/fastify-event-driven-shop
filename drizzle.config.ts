import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/database/schemas/**.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: String(process.env.DATABASE_URL),
	},
});
