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

	public uploadUniformFloat = (name: string, f1: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform1f(location, f1);
	}
	public uploadUniformFloat2 = (name: string, f1: number, f2: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform2f(location, f1, f2);
	}
	public uploadUniformFloat3 = (name: string, f1: number, f2: number, f3: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform3f(location, f1, f2, f3);
	}
	public uploadUniformFloat4 = (name: string, f1: number, f2: number, f3: number, f4: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform4f(location, f1, f2, f3, f4);
	}

	public uploadUniformVec2 = (name: string, vec2: Float32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform2fv(location, vec2);
	}
	public uploadUniformVec3 = (name: string, vec3: Float32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform3fv(location, vec3);
	}
	public uploadUniformVec4 = (name: string, vec4: Float32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform4fv(location, vec4);
	}

	public uploadUniformInt = (name: string, i1: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform1i(location, i1);
	}
	public uploadUniformInt2 = (name: string, i1: number, i2: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform2i(location, i1, i2);
	}
	public uploadUniformInt3 = (name: string, i1: number, i2: number, i3: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform3i(location, i1, i2, i3);
	}
	public uploadUniformInt4 = (name: string, i1: number, i2: number, i3: number, i4: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform4i(location, i1, i2, i3, i4);
	}

	public uploadUniformIVec2 = (name: string, ivec2: Int32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform2iv(location, ivec2);
	}
	public uploadUniformIVec3 = (name: string, ivec3: Int32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform3iv(location, ivec3);
	}
	public uploadUniformIVec4 = (name: string, ivec4: Int32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform4iv(location, ivec4);
	}

	public uploadUniformUInt = (name: string, ui1: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform1ui(location, ui1);
	}
	public uploadUniformUInt2 = (name: string, ui1: number, ui2: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform2ui(location, ui1, ui2);
	}
	public uploadUniformUInt3 = (name: string, ui1: number, ui2: number, ui3: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform3ui(location, ui1, ui2, ui3);
	}
	public uploadUniformUInt4 = (name: string, ui1: number, ui2: number, ui3: number, ui4: number): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform4ui(location, ui1, ui2, ui3, ui4);
	}

	public uploadUniformUVec2 = (name: string, uvec2: Uint32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform2uiv(location, uvec2);
	}
	public uploadUniformUVec3 = (name: string, uvec3: Uint32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform3uiv(location, uvec3);
	}
	public uploadUniformUVec4 = (name: string, uvec4: Uint32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniform4uiv(location, uvec4);
	}

	public uploadUniformMat2 = (name: string, mat2: Float32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniformMatrix2fv(location, false, mat2);
	}
	public uploadUniformMat3 = (name: string, mat3: Float32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniformMatrix3fv(location, false, mat3);
	}
	public uploadUniformMat4 = (name: string, mat4: Float32Array | number[]): void => {
		const location = Shader.ctx.getUniformLocation(this.id, name);
		Shader.ctx.uniformMatrix4fv(location, false, mat4);
	}


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
