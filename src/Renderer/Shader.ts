interface UniformBlockInfo {
	readonly index: number;
	readonly bufferId: WebGLBuffer;
	readonly size: number;
	readonly uniformsCount: number;
	readonly uniformsIndices: Uint32Array;
	readonly inVertex: boolean;
	readonly inFragment: boolean;
}


class Shader {
	private static ctx: WebGL2RenderingContext;
	public static init = (context: WebGL2RenderingContext): void => { Shader.ctx = context; }


	private id: WebGLProgram = 0;

	private readonly uniforms = new Map<string, { type: number, location: WebGLUniformLocation }>();
	private readonly uniformsBlock = new Map<string, UniformBlockInfo>();

	constructor(vertexSrc: string, fragmentSrc: string) {
		this.compile(new Map([
			[Shader.ctx.VERTEX_SHADER, vertexSrc],
			[Shader.ctx.FRAGMENT_SHADER, fragmentSrc]
		]));

		const uniformBlockCount = Shader.ctx.getProgramParameter(this.id, Shader.ctx.ACTIVE_UNIFORM_BLOCKS);

		for (let blockIndex = 0; blockIndex < uniformBlockCount; blockIndex++) {
			Shader.ctx.uniformBlockBinding(this.id, blockIndex, blockIndex);

			const size = Shader.ctx.getActiveUniformBlockParameter(this.id, blockIndex, Shader.ctx.UNIFORM_BLOCK_DATA_SIZE);

			const bufferId = Shader.ctx.createBuffer() as WebGLBuffer;
			Shader.ctx.bindBuffer(Shader.ctx.UNIFORM_BUFFER, bufferId);
			Shader.ctx.bufferData(Shader.ctx.UNIFORM_BUFFER, size, Shader.ctx.DYNAMIC_DRAW);

			this.uniformsBlock.set(Shader.ctx.getActiveUniformBlockName(this.id, blockIndex) as string, {
				index: blockIndex,
				bufferId,
				size,
				uniformsCount: Shader.ctx.getActiveUniformBlockParameter(this.id, blockIndex, Shader.ctx.UNIFORM_BLOCK_ACTIVE_UNIFORMS),
				uniformsIndices: Shader.ctx.getActiveUniformBlockParameter(this.id, blockIndex, Shader.ctx.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES),
				inVertex: Shader.ctx.getActiveUniformBlockParameter(this.id, blockIndex, Shader.ctx.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER),
				inFragment: Shader.ctx.getActiveUniformBlockParameter(this.id, blockIndex, Shader.ctx.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER)
			});
		}

		const uniformCount = Shader.ctx.getProgramParameter(this.id, Shader.ctx.ACTIVE_UNIFORMS);

		for (let i = 0; i < uniformCount; i++) {
			const uniform = Shader.ctx.getActiveUniform(this.id, i) as WebGLActiveInfo;
			const location = Shader.ctx.getUniformLocation(this.id, uniform.name) as WebGLUniformLocation;

			this.uniforms.set(uniform.name, { type: uniform.type, location });
		}
	}

	public bind = (): void => { Shader.ctx.useProgram(this.id); }
	public delete = (): void => { Shader.ctx.deleteProgram(this.id); }

	public uploadUniformFloat = (name: string, float: number | Float32Array | number[]): void => {
		Shader.ctx.uniform1fv(this.uniforms.get(name)?.location as WebGLUniformLocation, float as Float32Array);
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

	public uploadUniformInt = (name: string, int: number | Int32Array | number[]): void => {
		Shader.ctx.uniform1iv(this.uniforms.get(name)?.location as WebGLUniformLocation, int as Int32Array);
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

	public uploadUniformUInt = (name: string, uint: number | Uint32Array | number[]): void => {
		Shader.ctx.uniform1uiv(this.uniforms.get(name)?.location as WebGLUniformLocation, uint as Uint32Array);
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

	public uploadUniformBool = (name: string, bool: boolean | Uint32Array | number[]): void => {
		Shader.ctx.uniform1uiv(this.uniforms.get(name)?.location as WebGLUniformLocation, bool as Uint32Array);
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

	public uploadUniformBuffer = (name: string, buffer: ArrayBuffer): void => {
		const blockInfo = this.uniformsBlock.get(name) as UniformBlockInfo;
		Shader.ctx.bindBuffer(Shader.ctx.UNIFORM_BUFFER, blockInfo.bufferId);
		Shader.ctx.bufferSubData(Shader.ctx.UNIFORM_BUFFER, 0, buffer);
		Shader.ctx.bindBufferBase(Shader.ctx.UNIFORM_BUFFER, blockInfo.index, blockInfo.bufferId);
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
