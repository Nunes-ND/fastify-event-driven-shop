import type {
	FastifyReply,
	FastifyRequest,
	RouteGenericInterface,
} from 'fastify';
import { vi } from 'vitest';

export function setupMockFastify<
	GenericServices extends object = object,
	GenericRequest extends RouteGenericInterface = RouteGenericInterface,
>(mockServices: GenericServices) {
	const mockRequest = {
		server: {
			...mockServices,
		},
		log: {
			info: vi.fn(),
		},
		body: {},
		params: {},
		query: {},
		headers: {},
	} as unknown as FastifyRequest<GenericRequest>;

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	} as unknown as FastifyReply;

	return {
		mockRequest,
		mockReply,
	};
}
