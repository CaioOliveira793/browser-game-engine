import Screen from './Screen';
import Layer from './Layer';
import { EventCategory, TypedEvents } from './Events/Events';

abstract class Application {
	private screen: Screen;

	private isRunning: boolean;
	private previousTime: number;

	private layerList: Map<Layer, Layer>;

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.screen = new Screen(canvas, width, height, this.eventPropagator);

		this.isRunning = false;
		this.previousTime = 0;

		this.layerList = new Map();
	}

	public pushLayer(layer: Layer): void {
		this.layerList.set(layer, layer);
		layer.onAttach();
	}

	public popLayer(layer: Layer): boolean {
		if (this.layerList.delete(layer)) {
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

		if (this.isRunning) {
			this.layerList.forEach(layer => layer.onUpdate(deltaTime));

			requestAnimationFrame(this.run);
		}
	}

	private eventPropagator = (e: TypedEvents): void => {
		switch (e.category) {

		case EventCategory.Screen:
			this.onKeyboardEvent(e);
			this.layerList.forEach(layer => layer.onKeyboardEvent(e));
			break;

		case EventCategory.Keyboard:
			this.onScreenEvent(e);
			this.layerList.forEach(layer => layer.onScreenEvent(e));
			break;

		case EventCategory.Mouse:
			this.onMouseEvent(e);
			this.layerList.forEach(layer => layer.onMouseEvent(e));
			break;
		}
	}
}

export default Application;
