class Renderer {
	private static ctx: WebGL2RenderingContext;

	public static init = (context: WebGL2RenderingContext): void => {
		Renderer.ctx = context;
	}

	public static setViewport = (x: number, y: number, width: number, heigth: number): void => {
		Renderer.ctx.viewport(x, y, width, heigth);
	}

	public static setClearColor = (color: Float32Array): void => {
		Renderer.ctx.clearColor(color[0], color[1], color[2], color[3]);
	}

	public static clear = (): void => {
		Renderer.ctx.clear(Renderer.ctx.COLOR_BUFFER_BIT | Renderer.ctx.DEPTH_BUFFER_BIT);
	}
}


export default Renderer;
