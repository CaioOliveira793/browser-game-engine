class Shader {
	private static ctx: WebGL2RenderingContext;

	public static init = (context: WebGL2RenderingContext): void => { Shader.ctx = context; }


	private id: WebGLProgram = 0;

	private uniforms: Map<string, { type: number, location: WebGLUniformLocation }>

	constructor(vertexSrc: string, fragmentSrc: string) {
		this.compile(new Map([
			[Shader.ctx.VERTEX_SHADER, vertexSrc],
			[Shader.ctx.FRAGMENT_SHADER, fragmentSrc]
		]));

		this.uniforms = new Map();
		const uniformCount = Shader.ctx.getProgramParameter(this.id, Shader.ctx.ACTIVE_UNIFORMS);

		for (let i = 0; i < uniformCount; i++) {
			const uniform = Shader.ctx.getActiveUniform(this.id, i) as WebGLActiveInfo;

			this.uniforms.set(uniform.name,
				{
					type: uniform.type,
					location: Shader.ctx.getUniformLocation(this.id, uniform.name) as WebGLUniformLocation
				});
		}
	}

	public bind = (): void => { Shader.ctx.useProgram(this.id); }
	public delete = (): void => { Shader.ctx.deleteProgram(this.id); }

	public uploadUniformFloat = (name: string, f1: number): void => {
		Shader.ctx.uniform1f(this.uniforms.get(name)?.location as WebGLUniformLocation, f1);
	}
	public uploadUniformFloat2 = (name: string, f1: number, f2: number): void => {
		Shader.ctx.uniform2f(this.uniforms.get(name)?.location as WebGLUniformLocation, f1, f2);
	}
	public uploadUniformFloat3 = (name: string, f1: number, f2: number, f3: number): void => {
		Shader.ctx.uniform3f(this.uniforms.get(name)?.location as WebGLUniformLocation, f1, f2, f3);
	}
	public uploadUniformFloat4 = (name: string, f1: number, f2: number, f3: number, f4: number): void => {
		Shader.ctx.uniform4f(this.uniforms.get(name)?.location as WebGLUniformLocation, f1, f2, f3, f4);
	}

	public uploadUniformVec2 = (name: string, vec2: Float32Array | number[]): void => {
		Shader.ctx.uniform2fv(this.uniforms.get(name)?.location as WebGLUniformLocation, vec2);
	}
	public uploadUniformVec3 = (name: string, vec3: Float32Array | number[]): void => {
		Shader.ctx.uniform3fv(this.uniforms.get(name)?.location as WebGLUniformLocation, vec3);
	}
	public uploadUniformVec4 = (name: string, vec4: Float32Array | number[]): void => {
		Shader.ctx.uniform4fv(this.uniforms.get(name)?.location as WebGLUniformLocation, vec4);
	}

	public uploadUniformInt = (name: string, i1: number): void => {
		Shader.ctx.uniform1i(this.uniforms.get(name)?.location as WebGLUniformLocation, i1);
	}
	public uploadUniformInt2 = (name: string, i1: number, i2: number): void => {
		Shader.ctx.uniform2i(this.uniforms.get(name)?.location as WebGLUniformLocation, i1, i2);
	}
	public uploadUniformInt3 = (name: string, i1: number, i2: number, i3: number): void => {
		Shader.ctx.uniform3i(this.uniforms.get(name)?.location as WebGLUniformLocation, i1, i2, i3);
	}
	public uploadUniformInt4 = (name: string, i1: number, i2: number, i3: number, i4: number): void => {
		Shader.ctx.uniform4i(this.uniforms.get(name)?.location as WebGLUniformLocation, i1, i2, i3, i4);
	}

	public uploadUniformIVec2 = (name: string, ivec2: Int32Array | number[]): void => {
		Shader.ctx.uniform2iv(this.uniforms.get(name)?.location as WebGLUniformLocation, ivec2);
	}
	public uploadUniformIVec3 = (name: string, ivec3: Int32Array | number[]): void => {
		Shader.ctx.uniform3iv(this.uniforms.get(name)?.location as WebGLUniformLocation, ivec3);
	}
	public uploadUniformIVec4 = (name: string, ivec4: Int32Array | number[]): void => {
		Shader.ctx.uniform4iv(this.uniforms.get(name)?.location as WebGLUniformLocation, ivec4);
	}

	public uploadUniformUInt = (name: string, ui1: number): void => {
		Shader.ctx.uniform1ui(this.uniforms.get(name)?.location as WebGLUniformLocation, ui1);
	}
	public uploadUniformUInt2 = (name: string, ui1: number, ui2: number): void => {
		Shader.ctx.uniform2ui(this.uniforms.get(name)?.location as WebGLUniformLocation, ui1, ui2);
	}
	public uploadUniformUInt3 = (name: string, ui1: number, ui2: number, ui3: number): void => {
		Shader.ctx.uniform3ui(this.uniforms.get(name)?.location as WebGLUniformLocation, ui1, ui2, ui3);
	}
	public uploadUniformUInt4 = (name: string, ui1: number, ui2: number, ui3: number, ui4: number): void => {
		Shader.ctx.uniform4ui(this.uniforms.get(name)?.location as WebGLUniformLocation, ui1, ui2, ui3, ui4);
	}

	public uploadUniformUVec2 = (name: string, uvec2: Uint32Array | number[]): void => {
		Shader.ctx.uniform2uiv(this.uniforms.get(name)?.location as WebGLUniformLocation, uvec2);
	}
	public uploadUniformUVec3 = (name: string, uvec3: Uint32Array | number[]): void => {
		Shader.ctx.uniform3uiv(this.uniforms.get(name)?.location as WebGLUniformLocation, uvec3);
	}
	public uploadUniformUVec4 = (name: string, uvec4: Uint32Array | number[]): void => {
		Shader.ctx.uniform4uiv(this.uniforms.get(name)?.location as WebGLUniformLocation, uvec4);
	}

	public uploadUniformBool = (name: string, b1: boolean): void => {
		Shader.ctx.uniform1ui(this.uniforms.get(name)?.location as WebGLUniformLocation, b1 as unknown as number);
	}
	public uploadUniformBool2 = (name: string, b1: boolean, b2: boolean): void => {
		Shader.ctx.uniform2ui(this.uniforms.get(name)?.location as WebGLUniformLocation,
			b1 as unknown as number,
			b2 as unknown as number);
	}
	public uploadUniformBool3 = (name: string, b1: boolean, b2: boolean, b3: boolean): void => {
		Shader.ctx.uniform3ui(this.uniforms.get(name)?.location as WebGLUniformLocation,
			b1 as unknown as number,
			b2 as unknown as number,
			b3 as unknown as number);
	}
	public uploadUniformBool4 = (name: string, b1: boolean, b2: boolean, b3: boolean, b4: boolean): void => {
		Shader.ctx.uniform4ui(this.uniforms.get(name)?.location as WebGLUniformLocation,
			b1 as unknown as number,
			b2 as unknown as number,
			b3 as unknown as number,
			b4 as unknown as number);
	}

	public uploadUniformBVec2 = (name: string, bvec2: Uint32Array | boolean[]): void => {
		Shader.ctx.uniform2uiv(this.uniforms.get(name)?.location as WebGLUniformLocation, bvec2 as unknown as number[]);
	}
	public uploadUniformBVec3 = (name: string, bvec3: Uint32Array | boolean[]): void => {
		Shader.ctx.uniform3uiv(this.uniforms.get(name)?.location as WebGLUniformLocation, bvec3 as unknown as number[]);
	}
	public uploadUniformBVec4 = (name: string, bvec4: Uint32Array | boolean[]): void => {
		Shader.ctx.uniform4uiv(this.uniforms.get(name)?.location as WebGLUniformLocation, bvec4 as unknown as number[]);
	}

	public uploadUniformMat2 = (name: string, mat2: Float32Array | number[]): void => {
		Shader.ctx.uniformMatrix2fv(this.uniforms.get(name)?.location as WebGLUniformLocation, false, mat2);
	}
	public uploadUniformMat3 = (name: string, mat3: Float32Array | number[]): void => {
		Shader.ctx.uniformMatrix3fv(this.uniforms.get(name)?.location as WebGLUniformLocation, false, mat3);
	}
	public uploadUniformMat4 = (name: string, mat4: Float32Array | number[]): void => {
		Shader.ctx.uniformMatrix4fv(this.uniforms.get(name)?.location as WebGLUniformLocation, false, mat4);
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
