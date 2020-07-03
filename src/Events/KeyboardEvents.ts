import { BaseEvent, EventCategory, EventType } from './Events';
import { KeyCodeMapTable } from '../Inputs/KeyCodes';


export class KeyPressEvent implements BaseEvent {
	public handled: boolean;

	public readonly category: EventCategory;
	public readonly type: EventType;

	public readonly code: number;
	public readonly repeat: boolean;
	public readonly shiftOn: boolean;
	public readonly ctrlOn: boolean;
	public readonly altOn: boolean;
	public readonly superOn: boolean;

	constructor(code: keyof typeof KeyCodeMapTable, repeat: boolean, shiftOn: boolean,
		ctrlOn: boolean, altOn: boolean, superOn: boolean) {
		this.code =  KeyCodeMapTable[code];
		this.repeat = repeat;
		this.shiftOn = shiftOn;
		this.ctrlOn = ctrlOn;
		this.altOn = altOn;
		this.superOn = superOn;

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
	public readonly shiftOn: boolean;
	public readonly ctrlOn: boolean;
	public readonly altOn: boolean;
	public readonly superOn: boolean;

	constructor(code: keyof typeof KeyCodeMapTable, shiftOn: boolean, ctrlOn: boolean,
		altOn: boolean, superOn: boolean) {
		this.code =  KeyCodeMapTable[code];
		this.shiftOn = shiftOn;
		this.ctrlOn = ctrlOn;
		this.altOn = altOn;
		this.superOn = superOn;

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
	public readonly shiftOn: boolean;
	public readonly ctrlOn: boolean;
	public readonly altOn: boolean;
	public readonly superOn: boolean;

	constructor(code: keyof typeof KeyCodeMapTable, shiftOn: boolean, ctrlOn: boolean,
		altOn: boolean, superOn: boolean) {
		this.code =  KeyCodeMapTable[code];
		this.shiftOn = shiftOn;
		this.ctrlOn = ctrlOn;
		this.altOn = altOn;
		this.superOn = superOn;

		this.handled = false;
		this.category = EventCategory.Keyboard;
		this.type = EventType.KeyTyped;
	}
}
