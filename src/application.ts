import { TypedEvents } from './Events/Events';
import { ScreenResizeEvent, ScreenCloseEvent, ScreenFocusEvent, ScreenBlurEvent } from './Events/ScreenEvents';
import { KeyCodeMapTable } from './Inputs/KeyCodes';
import { KeyPressEvent, KeyReleaseEvent, KeyTypedEvent } from './Events/KeyboardEvents';
import { MouseButtonTypedEvent, MouseButtonReleaseEvent, MouseMoveEvent, MouseScrollEvent } from './Events/MouseEvents';

abstract class Application {
	private canvas: HTMLCanvasElement;
	private context: WebGLRenderingContext;
	private resolutionOffFullscreen: { width: number, height: number };

	private observer: MutationObserver;

	private isRunning: boolean;
	private previousTime: number;

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
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

		this.isRunning = false;
		this.previousTime = 0;

		this.resolutionOffFullscreen = {
			width: this.canvas.width,
			height: this.canvas.height
		};

		this.observer = new MutationObserver(this.handleScreenCloseMutationCallback);
	}

	protected abstract onEvent: (e: TypedEvents) => void;

	public init = (): void => {
		this.addEvents();
		this.isRunning = true;
		requestAnimationFrame(this.run);
	}

	public end = (): void => {
		this.removeEvents();
		this.isRunning = false;
	}

	public requestFullscreen = (): Promise<void> => {
		return this.canvas.requestFullscreen({
			navigationUI: 'hide'
		});
	}

	// game loop:
	private run = (time: number): void => {
		const deltaTime = time - this.previousTime;
		this.previousTime = time;

		if (this.isRunning) {
			// game logic
		} else {
			// game on pause
		}
		requestAnimationFrame(this.run);
	}

	// add events callbacks:
	private addEvents = (): void => {
		// screen events:
		this.canvas.addEventListener('fullscreenchange', this.handleFullScreen, true);
		this.canvas.addEventListener('focus', this.handleScreenFocus, true);
		this.canvas.addEventListener('blur', this.handleScreenBlur, true);
		this.observer.observe(this.canvas.parentElement as HTMLElement, { childList: true });

		// keyboard events:
		this.canvas.addEventListener('keydown', this.handleKeyboardDown, true);
		this.canvas.addEventListener('keyup', this.handleKeyboardUp, true);

		// mouse events:
		this.canvas.addEventListener('mousedown', this.handleMouseDown, true);
		this.canvas.addEventListener('mouseup', this.handleMouseUp, true);
		this.canvas.addEventListener('mousemove', this.handleMouseMove, true);
		this.canvas.addEventListener('wheel', this.handleMouseScroll, true);
	}

	// remove events callbacks:
	private removeEvents = (): void => {
		// screen events:
		this.canvas.removeEventListener('fullscreenchange', this.handleFullScreen, true);
		this.canvas.removeEventListener('focus', this.handleScreenFocus, true);
		this.canvas.removeEventListener('blur', this.handleScreenBlur, true);
		this.observer.disconnect();

		// keyboard events:
		this.canvas.removeEventListener('keydown', this.handleKeyboardDown, true);
		this.canvas.removeEventListener('keyup', this.handleKeyboardUp, true);

		// mouse events:
		this.canvas.removeEventListener('mousedown', this.handleMouseDown, true);
		this.canvas.removeEventListener('mouseup', this.handleMouseUp, true);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove, true);
		this.canvas.removeEventListener('wheel', this.handleMouseScroll, true);
	}


	// events: ////////////////////////////////////////////////////////
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
		this.onEvent(e);
	}

	private handleScreenCloseMutationCallback: MutationCallback = (): void => {
		if (!document.contains(this.canvas)) {
			const e = new ScreenCloseEvent();
			this.onEvent(e);
		}
	}

	private handleScreenFocus = (event: FocusEvent): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const e = new ScreenFocusEvent();
		this.onEvent(e);
	}

	private handleScreenBlur = (event: FocusEvent): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const e = new ScreenBlurEvent();
		this.onEvent(e);
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
			this.onEvent(typedEvent);
		}

		this.onEvent(pressEvent);
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
		this.onEvent(e);
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
		this.onEvent(e);
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
		this.onEvent(e);
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
		this.onEvent(e);
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
		this.onEvent(e);
	}
}

export default Application;
