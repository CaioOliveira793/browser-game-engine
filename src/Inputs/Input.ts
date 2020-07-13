import Key from './KeyCodes';
import MouseButtons from './MouseCodes';
import { EventType } from '../Events/Events';
import { KeyTypedEvent } from '../Events/KeyboardEvents';
import { MouseButtonTypedEvent, MouseMoveEvent } from '../Events/MouseEvents';


export type InputEvents = MouseButtonTypedEvent & MouseMoveEvent & KeyTypedEvent;

class Input {
	private static codesTyped = new Set<Key | MouseButtons>();
	private static codesPressed = new Set<Key | MouseButtons>();
	private static codesReleased = new Set<Key | MouseButtons>();

	private static mousePosition = { x: 0, y: 0 };

	public static isPressed = (key: Key | MouseButtons): boolean => Input.codesPressed.has(key);
	public static isReleased = (key: Key | MouseButtons): boolean => Input.codesReleased.has(key);
	public static isTyped = (key: Key | MouseButtons): boolean => Input.codesTyped.has(key);

	public static getMousePosition = (): { x: number, y: number } => Input.mousePosition;

	// called each keyboard and mouse event:
	public static update = (e: InputEvents): void => {
		if (e.type === EventType.KeyTyped || e.type === EventType.MouseButtonTyped) {
			const key = e?.code ?? e?.button;

			Input.codesTyped.add(key);
			Input.codesPressed.add(key);

		} else if (e.type === EventType.KeyRelease || e.type === EventType.MouseButtonRelease) {
			const key = e?.code ?? e?.button;

			Input.codesPressed.delete(key);
			Input.codesReleased.add(key);

		} else if (e.type === EventType.MouseMove) {
			Input.mousePosition = e.position;
		}
	}

	// called each frame:
	public static reset = (): void => {
		Input.codesTyped.clear();
		Input.codesReleased.clear();
	}
}

export default Input;
