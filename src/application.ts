import Screen, { EventCallback } from './Screen';


abstract class Application {
	private screen: Screen;

	private isRunning: boolean;
	private previousTime: number;

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.screen = new Screen(canvas, width, height, this.eventPropagator);

		this.isRunning = false;
		this.previousTime = 0;
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
			// game logic

			requestAnimationFrame(this.run);
		} else {
			// game on pause
		}
	}

	private eventPropagator: EventCallback = (e) => {
		this.onEvent(e);

		// propagate events to layers below:
		// layers.forEach(...);
	}
}

export default Application;
