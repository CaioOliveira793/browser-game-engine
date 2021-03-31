import Application from '@engine/Application';
import ExempleLayer from './layer';


class MyApp extends Application {
	private layer: ExempleLayer;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this.layer = new ExempleLayer;

		this.pushLayer(this.layer);
	}

	protected onScreenEvent = (): void => {/* */}
	protected onKeyboardEvent = (): void => {/* */}
	protected onMouseEvent = (): void => {/* */}
}


// creating app:
const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;

const app = new MyApp(canvas);
app.init();


// set fullscreen:
const fullscreenButton = document.getElementById('fullscreen-button') as HTMLButtonElement;

fullscreenButton.addEventListener('click', () => {
	app.requestFullscreen().catch(console.log);
});
