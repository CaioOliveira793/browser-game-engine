import Screen from './Screen';
import Layer from './Layer';
import { EventCategory, TypedEvents, EventType } from './Events/Events';

abstract class Application {
	private screen: Screen;

	private isRunning: boolean;
	private previousTime: number;

	private layerQueue: Map<Layer, Layer>;

	private eventQueue: Map<EventType, TypedEvents>;

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.screen = new Screen(canvas, width, height, this.storeEvents);

		this.isRunning = false;
		this.previousTime = 0;

		this.layerQueue = new Map();

		this.eventQueue = new Map();
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

		this.eventQueue.forEach(event => this.eventPropagator(event));
		this.eventQueue.clear();

		if (this.isRunning) {
			this.layerQueue.forEach(layer => layer.onUpdate(deltaTime));

			requestAnimationFrame(this.run);
		}
	}

	private eventPropagator = (e: TypedEvents): void => {
		switch (e.category) {

		case EventCategory.Screen:
			this.onKeyboardEvent(e);
			this.layerQueue.forEach(layer => layer.onKeyboardEvent(e));
			break;

		case EventCategory.Keyboard:
			this.onScreenEvent(e);
			this.layerQueue.forEach(layer => layer.onScreenEvent(e));
			break;

		case EventCategory.Mouse:
			this.onMouseEvent(e);
			this.layerQueue.forEach(layer => layer.onMouseEvent(e));
			break;
		}
	}

	private storeEvents = (e: TypedEvents): void => {
		this.eventQueue.set(e.type, e);
	}
}

export default Application;
