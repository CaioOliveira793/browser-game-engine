import Application from '@engine/Application';
import ExempleLayer from './exemple.layer';


class MyApp extends Application {
	private layer: ExempleLayer;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas, 854, 480);
		this.layer = new ExempleLayer;

		super.pushLayer(this.layer);

		setTimeout(() => {
			super.popLayer(this.layer);
		}, 10000);
	}

	protected onScreenEvent = (): void => {/* */}
	protected onKeyboardEvent = (): void => {/* */}
	protected onMouseEvent = (): void => {/* */}
}


// creating app:
const canvas = document.getElementById('test-canvas') as HTMLCanvasElement;

const app = new MyApp(canvas);
app.init();


// set fullscreen:
const fullscreenButton = document.getElementById('fullscreen') as HTMLButtonElement;

fullscreenButton.addEventListener('click', () => {
	app.requestFullscreen().catch(err => console.log(err));
});
