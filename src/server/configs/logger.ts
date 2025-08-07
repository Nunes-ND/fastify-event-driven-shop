const loggerOptions = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
	},
	production: true,
	test: false,
};

const environment = process.env.NODE_ENV ?? 'development';
export const loggerConfig =
	loggerOptions[environment as keyof typeof loggerOptions];
