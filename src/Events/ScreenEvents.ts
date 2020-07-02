import { BaseEvent, EventCategory, EventType } from './Events';

export class ScreenResizeEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	public readonly width: number;
	public readonly height: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.handled = false;
		this.category = EventCategory.Application;
		this.type = EventType.ScreenResize;
	}
}

export class ScreenCloseEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	constructor() {
		this.handled = false;
		this.category = EventCategory.Application;
		this.type = EventType.ScreenClose;
	}
}

export class ScreenFocusEvent implements BaseEvent {
	public readonly handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	constructor() {
		this.handled = false;
		this.category = EventCategory.Application;
		this.type = EventType.ScreenFocus;
	}
}

export class ScreenBlurEvent implements BaseEvent {
	public readonly handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	constructor() {
		this.handled = false;
		this.category = EventCategory.Application;
		this.type = EventType.ScreenBlur;
	}
}
