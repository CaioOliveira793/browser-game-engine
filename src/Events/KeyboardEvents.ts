import { BaseEvent, EventCategory, EventType } from './Events';
import { KeyCodeMapTable } from '../Inputs/KeyCodes';


export type KeyboardCommandKeys = {
	shiftOn: boolean;
	ctrlOn: boolean;
	altOn: boolean;
	superOn: boolean;
};


export class KeyPressEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	public readonly code: number;
	public readonly repeat: boolean;
	public readonly command: KeyboardCommandKeys;

	constructor(code: keyof typeof KeyCodeMapTable, repeat: boolean, commandKeys: KeyboardCommandKeys) {
		this.code =  KeyCodeMapTable[code];
		this.repeat = repeat;
		this.command = commandKeys;

		this.handled = false;
		this.category = EventCategory.Keyboard;
		this.type = EventType.KeyPress;
	}
}

export class KeyReleaseEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	public readonly code: number;
	public readonly command: KeyboardCommandKeys;

	constructor(code: keyof typeof KeyCodeMapTable, commandKeys: KeyboardCommandKeys) {
		this.code =  KeyCodeMapTable[code];
		this.command = commandKeys;

		this.handled = false;
		this.category = EventCategory.Keyboard;
		this.type = EventType.KeyRelease;
	}
}

export class KeyTypedEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	public readonly code: number;
	public readonly command: KeyboardCommandKeys;

	constructor(code: keyof typeof KeyCodeMapTable, commandKeys: KeyboardCommandKeys) {
		this.code =  KeyCodeMapTable[code];
		this.command = commandKeys;

		this.handled = false;
		this.category = EventCategory.Keyboard;
		this.type = EventType.KeyTyped;
	}
}
