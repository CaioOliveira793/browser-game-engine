import { ScreenResizeEvent, ScreenCloseEvent } from './ScreenEvents';

export enum EventCategory {
	None = 0,
	Application,
	Keyboard,
	Mouse
}

export enum EventType {
	None = 0,
	ScreenResize, ScreenClose, ScreenFocus, ScreenBlur,
	KeyPress, KeyRelease, KeyTyped,
	MouseBottonPress, MouseBottonRelease, MouseMove, MouseScroll
}

export interface BaseEvent {
	handled: boolean;

	readonly category: EventCategory;
	readonly type: EventType;
}

export type TypedEvents =
ScreenResizeEvent | ScreenCloseEvent;

export type EventCallback<T extends TypedEvents> = (event: T) => boolean;

export class EventDispatcher {
	private event: BaseEvent;

	constructor(event: BaseEvent) {
		this.event = event;
	}

	dispatch = <T extends TypedEvents>(type: EventType, callback: EventCallback<T>): boolean => {
		if (this.event.type === type) {
			this.event.handled = callback(this.event as T);
			return true;
		}
		return false;
	}
}
