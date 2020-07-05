import { TypedEvents } from './Events/Events';
import { ScreenResizeEvent, ScreenCloseEvent, ScreenFocusEvent, ScreenBlurEvent } from './Events/ScreenEvents';
import { KeyCodeMapTable } from './Inputs/KeyCodes';
import { KeyPressEvent, KeyReleaseEvent, KeyTypedEvent } from './Events/KeyboardEvents';
import { MouseButtonTypedEvent, MouseButtonReleaseEvent, MouseMoveEvent, MouseScrollEvent } from './Events/MouseEvents';


export type EventCallback = (e: TypedEvents) => void;

export class Screen {
	private canvas: HTMLCanvasElement;
	private context: WebGLRenderingContext;

	private resolutionOffFullscreen: { width: number, height: number };

	private observer: MutationObserver;
	private eventCallback: EventCallback;

	constructor(canvas: HTMLCanvasElement, width: number, height: number, eventCallback: EventCallback) {
		this.canvas = canvas;
		this.canvas.width = width;
		this.canvas.height = height;
		this.canvas.tabIndex = 0;

		const webgl = canvas.getContext('webgl');

		if (webgl) {
			this.context = webgl;
		} else {
			throw new Error('Your browser appears not support WebGL');
		}

		this.eventCallback = eventCallback;

		this.resolutionOffFullscreen = {
			width: this.canvas.width,
			height: this.canvas.height
		};

		this.observer = new MutationObserver(this.handleScreenCloseMutationCallback);
	}

	public getWidth = (): number => { return this.canvas.width; }
	public getHeight = (): number => { return this.canvas.height; }

	public getContext = (): WebGLRenderingContext => { return this.context; }

	public setFullscreen = (): Promise<void> => {
		return this.canvas.requestFullscreen({ navigationUI: 'hide' });
	}

	public addEvents = (): void => {
		const listenerOptions = {
			capture: true,
			once: false,
			passive: false
		};

		// screen events:
		this.canvas.addEventListener('fullscreenchange', this.handleFullScreen, listenerOptions);
		this.canvas.addEventListener('focus', this.handleScreenFocus, listenerOptions);
		this.canvas.addEventListener('blur', this.handleScreenBlur, listenerOptions);
		this.observer.observe(this.canvas.parentElement as HTMLElement, { childList: true });

		// keyboard events:
		this.canvas.addEventListener('keydown', this.handleKeyboardDown, listenerOptions);
		this.canvas.addEventListener('keyup', this.handleKeyboardUp, listenerOptions);

		// mouse events:
		this.canvas.addEventListener('mousedown', this.handleMouseDown, listenerOptions);
		this.canvas.addEventListener('mouseup', this.handleMouseUp, listenerOptions);
		this.canvas.addEventListener('mousemove', this.handleMouseMove, listenerOptions);
		this.canvas.addEventListener('wheel', this.handleMouseScroll, listenerOptions);
	}

	public removeEvents = (): void => {
		const listenerOptions = {
			capture: true,
			once: false,
			passive: false
		};

		// screen events:
		this.canvas.removeEventListener('fullscreenchange', this.handleFullScreen, listenerOptions);
		this.canvas.removeEventListener('focus', this.handleScreenFocus, listenerOptions);
		this.canvas.removeEventListener('blur', this.handleScreenBlur, listenerOptions);
		this.observer.disconnect();

		// keyboard events:
		this.canvas.removeEventListener('keydown', this.handleKeyboardDown, listenerOptions);
		this.canvas.removeEventListener('keyup', this.handleKeyboardUp, listenerOptions);

		// mouse events:
		this.canvas.removeEventListener('mousedown', this.handleMouseDown, listenerOptions);
		this.canvas.removeEventListener('mouseup', this.handleMouseUp, listenerOptions);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove, listenerOptions);
		this.canvas.removeEventListener('wheel', this.handleMouseScroll, listenerOptions);
	}

	//// screen: //////////////////////////////////////////////////////
	private handleFullScreen = (event: Event): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		if (document.fullscreen) {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		} else {
			this.canvas.width = this.resolutionOffFullscreen.width;
			this.canvas.height = this.resolutionOffFullscreen.height;
		}

		const e = new ScreenResizeEvent(this.canvas.width, this.canvas.height);
		this.eventCallback(e);
	}

	private handleScreenCloseMutationCallback: MutationCallback = (): void => {
		if (!document.contains(this.canvas)) {
			const e = new ScreenCloseEvent();
			this.eventCallback(e);
		}
	}

	private handleScreenFocus = (event: FocusEvent): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const e = new ScreenFocusEvent();
		this.eventCallback(e);
	}

	private handleScreenBlur = (event: FocusEvent): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const e = new ScreenBlurEvent();
		this.eventCallback(e);
	}

	//// keyboard: ////////////////////////////////////////////////////
	private handleKeyboardDown = (event: KeyboardEvent): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const commandKeys = {
			shiftOn: event.shiftKey,
			ctrlOn: event.ctrlKey,
			altOn: event.altKey,
			superOn: event.metaKey
		};

		const pressEvent = new KeyPressEvent(event.code as keyof typeof KeyCodeMapTable,
			event.repeat, commandKeys);

		if (!event.repeat) {
			const typedEvent = new KeyTypedEvent(event.code as keyof typeof KeyCodeMapTable, commandKeys);
			this.eventCallback(typedEvent);
		}

		this.eventCallback(pressEvent);
	}

	private handleKeyboardUp = (event: KeyboardEvent): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const commandKeys = {
			shiftOn: event.shiftKey,
			ctrlOn: event.ctrlKey,
			altOn: event.altKey,
			superOn: event.metaKey
		};

		const e = new KeyReleaseEvent(event.code as keyof typeof KeyCodeMapTable, commandKeys);
		this.eventCallback(e);
	}

	//// mouse: ///////////////////////////////////////////////////////
	private handleMouseDown = (event: MouseEvent): void => {
		event.stopImmediatePropagation();

		const commandKeys = {
			shiftOn: event.shiftKey,
			ctrlOn: event.ctrlKey,
			altOn: event.altKey,
			superOn: event.metaKey
		};

		const position = {
			x: event.offsetX,
			y: event.offsetY,
		};

		const e = new MouseButtonTypedEvent(event.button, position, commandKeys);
		this.eventCallback(e);
	}

	private handleMouseUp = (event: MouseEvent): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const commandKeys = {
			shiftOn: event.shiftKey,
			ctrlOn: event.ctrlKey,
			altOn: event.altKey,
			superOn: event.metaKey
		};

		const position = {
			x: event.offsetX,
			y: event.offsetY,
		};

		const e = new MouseButtonReleaseEvent(event.button, position, commandKeys);
		this.eventCallback(e);
	}

	private handleMouseMove = (event: MouseEvent): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const commandKeys = {
			shiftOn: event.shiftKey,
			ctrlOn: event.ctrlKey,
			altOn: event.altKey,
			superOn: event.metaKey
		};

		const position = {
			x: event.offsetX,
			y: event.offsetY,
		};

		const e = new MouseMoveEvent(position, commandKeys);
		this.eventCallback(e);
	}

	private handleMouseScroll = (event: WheelEvent): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const commandKeys = {
			shiftOn: event.shiftKey,
			ctrlOn: event.ctrlKey,
			altOn: event.altKey,
			superOn: event.metaKey
		};

		const position = {
			x: event.offsetX,
			y: event.offsetY,
		};

		const e = new MouseScrollEvent(event.deltaY, position, commandKeys);
		this.eventCallback(e);
	}
}

export default Screen;
