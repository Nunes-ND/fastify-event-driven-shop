import EventEmitter from 'node:events';

export class EventService extends EventEmitter {
	private static instance: EventService | null = null;

	private constructor() {
		super();
	}

	static getInstance() {
		if (!EventService.instance) {
			EventService.instance = new EventService();
		}
		return EventService.instance;
	}
}

export const eventService = EventService.getInstance();
