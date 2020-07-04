import { ScreenResizeEvent, ScreenCloseEvent, ScreenFocusEvent, ScreenBlurEvent } from './ScreenEvents';
import { KeyPressEvent, KeyReleaseEvent, KeyTypedEvent } from './KeyboardEvents';
import { MouseButtonTypedEvent, MouseButtonReleaseEvent, MouseMoveEvent, MouseScrollEvent } from './MouseEvents';


export enum EventCategory {
	None = 0,
	Screen,
	Keyboard,
	Mouse
}

export enum EventType {
	None = 0,
	ScreenResize, ScreenClose, ScreenFocus, ScreenBlur,
	KeyPress, KeyRelease, KeyTyped,
	MouseButtonTyped, MouseButtonRelease, MouseMove, MouseScroll
}

export interface BaseEvent {
	handled: boolean;

	readonly category: EventCategory;
	readonly type: EventType;
}

export type TypedEvents =
ScreenResizeEvent | ScreenCloseEvent | ScreenFocusEvent | ScreenBlurEvent |
KeyPressEvent | KeyReleaseEvent | KeyTypedEvent |
MouseButtonTypedEvent | MouseButtonReleaseEvent | MouseMoveEvent | MouseScrollEvent;

export type EventCallback<T extends TypedEvents> = (event: T) => boolean;

export class EventDispatcher {
	private event: BaseEvent;

	constructor(event: BaseEvent) {
		this.event = event;
	}

	dispatch = <T extends TypedEvents>(type: EventType, callback: EventCallback<T>): boolean => {
		if (this.event.type === type && !this.event.handled) {
			this.event.handled = callback(this.event as T);
			return true;
		}
		return false;
	}
}
