import Screen, { EventCallback } from './Screen';
import Layer from './Layer';

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
	protected abstract onEvent: EventCallback;

	private run = (time: number): void => {
		const deltaTime = time - this.previousTime;
		this.previousTime = time;

		if (this.isRunning) {
			this.layerList.forEach(layer => layer.onUpdate(deltaTime));

			requestAnimationFrame(this.run);
		}
	}

	private eventPropagator: EventCallback = (e) => {
		this.onEvent(e);

		this.layerList.forEach(layer => layer.onEvent(e));
	}
}

export default Application;
