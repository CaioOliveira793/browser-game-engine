class Shader {
	private static ctx: WebGL2RenderingContext;

	public static init = (context: WebGL2RenderingContext): void => { Shader.ctx = context; }


	private id: WebGLProgram = 0;

	private name: string;

	constructor(name: string, vertexSrc: string, fragmentSrc: string) {
		this.name = name;

		this.compile(new Map([
			[Shader.ctx.VERTEX_SHADER, vertexSrc],
			[Shader.ctx.FRAGMENT_SHADER, fragmentSrc]
		]));
	}

	public getName = (): string => this.name;

	public bind = (): void => { Shader.ctx.useProgram(this.id); }
	public delete = (): void => { Shader.ctx.deleteProgram(this.id); }

	private compile = (sources: Map<GLenum, string>): void => {
		this.id = Shader.ctx.createProgram() as WebGLProgram;
		const shadersId = new Set<WebGLShader>();

		for (const [type, src] of sources) {
			const shader = Shader.ctx.createShader(type) as WebGLShader;

			Shader.ctx.shaderSource(shader, src);
			Shader.ctx.compileShader(shader);

			Shader.ctx.attachShader(this.id, shader);
			shadersId.add(shader);
		}

		Shader.ctx.linkProgram(this.id);

		shadersId.forEach(shader => {
			Shader.ctx.detachShader(this.id, shader);
			Shader.ctx.deleteShader(shader);
		});
	}
}


export default Shader;
