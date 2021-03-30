import Screen from './Screen';
import Layer from './Layer';
import { EventCategory, TypedEvents } from './Events/Events';
import Input, { InputEvents } from './Inputs/Input';

abstract class Application {
	private screen: Screen;

	private isRunning: boolean;
	private previousTime: number;

	private layerQueue: Set<Layer>;
	private overlayQueue: Set<Layer>;
	private eventQueue: Set<TypedEvents>;

	constructor(canvas: HTMLCanvasElement) {
		this.screen = new Screen(canvas, this.storeEvents);

		this.isRunning = false;
		this.previousTime = 0;

		this.layerQueue = new Set();
		this.overlayQueue = new Set();
		this.eventQueue = new Set();
	}

	public pushLayer = (layer: Layer): void => {
		this.layerQueue.add(layer);
		layer.onAttach();
	}

	public popLayer = (layer: Layer): boolean => {
		if (this.layerQueue.delete(layer)) {
			layer.onDetach();
			return true;
		}

		return false;
	}

	public pushOverlay = (overlay: Layer): void => {
		this.overlayQueue.add(overlay);
		overlay.onDetach();
	}

	public popOverlay = (overlay: Layer): boolean => {
		if (this.overlayQueue.delete(overlay)) {
			overlay.onDetach();
			return true;
		}

		return false;
	}

	public requestFullscreen = (): Promise<void> => this.screen.setFullscreen()

	public init = (): void => {
		this.screen.start();
		this.isRunning = true;
		requestAnimationFrame(this.run);
	}

	public end = (): void => {
		this.isRunning = false;
		this.screen.close();
	}

	// only called by the class Application
	protected abstract onScreenEvent: (e: TypedEvents) => void;
	protected abstract onKeyboardEvent: (e: TypedEvents) => void;
	protected abstract onMouseEvent: (e: TypedEvents) => void;

	private run = (time: number): void => {
		const deltaTime = (time - this.previousTime) / 1000;
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
				Input.updateScreenBlur(e);
				this.layerQueue.forEach(layer => layer.onScreenEvent(e));
				this.overlayQueue.forEach(overlay => overlay.onScreenEvent(e));
				break;

			case EventCategory.Keyboard:
				this.onKeyboardEvent(e);
				Input.updateKeysAndButtons(e as InputEvents);
				this.layerQueue.forEach(layer => layer.onKeyboardEvent(e));
				this.overlayQueue.forEach(overlay => overlay.onKeyboardEvent(e));
				break;

			case EventCategory.Mouse:
				this.onMouseEvent(e);
				Input.updateKeysAndButtons(e as InputEvents);
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
