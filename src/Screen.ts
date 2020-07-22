/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TypedEvents } from './Events/Events';
import { ScreenResizeEvent, ScreenCloseEvent, ScreenFocusEvent, ScreenBlurEvent } from './Events/ScreenEvents';
import { KeyCodeMapTable } from './Inputs/KeyCodes';
import { KeyPressEvent, KeyReleaseEvent, KeyTypedEvent } from './Events/KeyboardEvents';
import { MouseButtonTypedEvent, MouseButtonReleaseEvent, MouseMoveEvent, MouseScrollEvent } from './Events/MouseEvents';
import Renderer from './Renderer/Renderer';


export class Screen {
	private canvas: HTMLCanvasElement;
	private context: WebGL2RenderingContext;

	private screenCloseObserver: MutationObserver;
	// lib.dom.d.ts does not have the ResizeObserver yet
	// @ts-ignore
	private screenResizeObserver: ResizeObserver;
	private eventCallback: (e: TypedEvents) => void;

	constructor(canvas: HTMLCanvasElement, eventCallback: (e: TypedEvents) => void) {
		this.canvas = canvas;
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientWidth;
		this.canvas.tabIndex = 0;

		const webgl = canvas.getContext('webgl2');

		if (webgl) {
			this.context = webgl;
		} else {
			throw new Error('Your browser appears not support WebGL 2');
		}

		Renderer.init(this.context);

		this.eventCallback = eventCallback;
		this.screenCloseObserver = new MutationObserver(this.handleScreenCloseMutationCallback);
		// @ts-ignore
		this.screenResizeObserver = new ResizeObserver(this.handleScreenResizeMutationCallback);
	}

	public getWidth = (): number => this.canvas.clientWidth;
	public getHeight = (): number => this.canvas.clientHeight;

	public getContext = (): WebGL2RenderingContext => this.context;
	public getCanvas = (): HTMLCanvasElement => this.canvas;

	public setFullscreen = (): Promise<void> => this.canvas.requestFullscreen({ navigationUI: 'hide' });

	public addEvents = (): void => {
		const listenerOptions = {
			capture: true,
			once: false,
			passive: false
		};

		// screen events:
		this.canvas.addEventListener('focus', this.handleScreenFocus, listenerOptions);
		this.canvas.addEventListener('blur', this.handleScreenBlur, listenerOptions);
		this.screenResizeObserver.observe(this.canvas);
		this.screenCloseObserver.observe(this.canvas.parentElement as HTMLElement, {
			childList: true,
			attributes: false,
			characterData: false,
		});

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
		this.canvas.removeEventListener('focus', this.handleScreenFocus, listenerOptions);
		this.canvas.removeEventListener('blur', this.handleScreenBlur, listenerOptions);
		this.screenResizeObserver.disconnect();
		this.screenCloseObserver.disconnect();

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
	private handleScreenCloseMutationCallback = (): void => {
		if (!document.contains(this.canvas)) {
			const e = new ScreenCloseEvent();
			this.eventCallback(e);
		}
	}

	private handleScreenResizeMutationCallback = (): void => {
		const displayWidth = this.canvas.clientWidth;
		const displayHeight = this.canvas.clientHeight;

		this.canvas.width = displayWidth;
		this.canvas.height = displayHeight;
		Renderer.onScreenResize(displayWidth, displayHeight);

		const e = new ScreenResizeEvent(displayWidth, displayHeight);
		this.eventCallback(e);
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
			event.repeat,
			commandKeys);

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
