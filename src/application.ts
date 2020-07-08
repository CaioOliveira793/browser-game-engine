import Screen from './Screen';
import Layer from './Layer';
import { EventCategory, TypedEvents, EventType } from './Events/Events';
import Input, { InputEvents } from './Inputs/Input';

abstract class Application {
	private screen: Screen;

	private isRunning: boolean;
	private previousTime: number;

	private layerQueue: Map<Layer, Layer>;
	private overlayQueue: Map<Layer, Layer>;
	private eventQueue: Set<TypedEvents>;

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.screen = new Screen(canvas, width, height, this.storeEvents);

		this.isRunning = false;
		this.previousTime = 0;

		this.layerQueue = new Map();
		this.overlayQueue = new Map();
		this.eventQueue = new Set();
	}

	public pushLayer(layer: Layer): void {
		this.layerQueue.set(layer, layer);
		layer.onAttach();
	}

	public popLayer(layer: Layer): boolean {
		if (this.layerQueue.delete(layer)) {
			layer.onDetach();
			return true;
		}

		return false;
	}

	public pushOverlay(overlay: Layer): void {
		this.overlayQueue.set(overlay, overlay);
		overlay.onDetach();
	}

	public popOverlay(overlay: Layer): boolean {
		if (this.overlayQueue.delete(overlay)) {
			overlay.onDetach();
			return true;
		}

		return false;
	}

	public requestFullscreen = (): Promise<void> => {
		return this.screen.setFullscreen();
	}

	public init = (): void => {
		this.screen.addEvents();
		this.isRunning = true;
		requestAnimationFrame(this.run);
	}

	public end = (): void => {
		this.screen.removeEvents();
		this.isRunning = false;
	}

	// only called by the class Application
	protected abstract onScreenEvent: (e: TypedEvents) => void;
	protected abstract onKeyboardEvent: (e: TypedEvents) => void;
	protected abstract onMouseEvent: (e: TypedEvents) => void;

	private run = (time: number): void => {
		const deltaTime = time - this.previousTime;
		this.previousTime = time;

		Input.reset();
		this.eventQueue.forEach(event => this.eventPropagator(event));
		this.eventQueue.clear();

		if (this.isRunning) {
			this.layerQueue.forEach(layer => layer.onUpdate(deltaTime));
			this.overlayQueue.forEach(overlay => overlay.onUpdate(deltaTime));

			requestAnimationFrame(this.run);
		}
	}

	private eventPropagator = (e: TypedEvents): void => {
		switch (e.category) {
		case EventCategory.Screen:
			this.onScreenEvent(e);
			this.layerQueue.forEach(layer => layer.onScreenEvent(e));
			this.overlayQueue.forEach(overlay => overlay.onScreenEvent(e));
			break;

		case EventCategory.Keyboard:
			this.onKeyboardEvent(e);
			Input.update(e as InputEvents);
			this.layerQueue.forEach(layer => layer.onKeyboardEvent(e));
			this.overlayQueue.forEach(overlay => overlay.onKeyboardEvent(e));
			break;

		case EventCategory.Mouse:
			this.onMouseEvent(e);
			Input.update(e as InputEvents);
			this.layerQueue.forEach(layer => layer.onMouseEvent(e));
			this.overlayQueue.forEach(overlay => overlay.onMouseEvent(e));
			break;
		}
	}

	private storeEvents = (e: TypedEvents): void => {
		this.eventQueue.add(e);
	}
}

export default Application;
