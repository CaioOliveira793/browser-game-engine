

export interface ScreenProps extends WebGLContextAttributes {
	width: number;
	height: number;
}


class Application {
	private canvas: HTMLCanvasElement;
	private context: WebGLRenderingContext;

	constructor(canvas: HTMLCanvasElement, screenProperties: ScreenProps) {
		this.canvas = canvas;
		this.canvas.width = screenProperties.width;
		this.canvas.height = screenProperties.height;

		const webgl = canvas.getContext('webgl', screenProperties);

		if (webgl) {
			this.context = webgl;
		} else {
			throw new Error('Your browser appears not support WebGL');
		}
	}
}

export default Application;
