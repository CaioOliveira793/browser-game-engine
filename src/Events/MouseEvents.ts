import { BaseEvent, EventCategory, EventType } from './Events';
import { KeyboardCommandKeys } from './KeyboardEvents';


export type MousePosition = { x: number, y: number };

export class MouseButtonTypedEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	public readonly button: number;
	public readonly position: MousePosition;
	public readonly commandKeys: KeyboardCommandKeys;

	constructor(button: number, position: MousePosition, commandKeys: KeyboardCommandKeys) {
		this.button = button;
		this.position = position;
		this.commandKeys = commandKeys;

		this.handled = false;
		this.category = EventCategory.Mouse;
		this.type = EventType.MouseButtonTyped;
	}
}

export class MouseButtonReleaseEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	public readonly button: number;
	public readonly position: MousePosition;
	public readonly commandKeys: KeyboardCommandKeys;

	constructor(button: number, position: MousePosition, commandKeys: KeyboardCommandKeys) {
		this.button = button;
		this.position = position;
		this.commandKeys = commandKeys;

		this.handled = false;
		this.category = EventCategory.Mouse;
		this.type = EventType.MouseButtonRelease;
	}
}

export class MouseMoveEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	public readonly position: MousePosition;
	public readonly commandKeys: KeyboardCommandKeys;

	constructor(position: MousePosition, commandKeys: KeyboardCommandKeys) {
		this.position = position;
		this.commandKeys = commandKeys;

		this.handled = false;
		this.category = EventCategory.Mouse;
		this.type = EventType.MouseMove;
	}
}

export class MouseScrollEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	public readonly delta: number;
	public readonly position: MousePosition;
	public readonly commandKeys: KeyboardCommandKeys;

	constructor(delta: number, position: MousePosition, commandKeys: KeyboardCommandKeys) {
		this.delta = delta;
		this.position = position;
		this.commandKeys = commandKeys;

		this.handled = false;
		this.category = EventCategory.Mouse;
		this.type = EventType.MouseScroll;
	}
}
