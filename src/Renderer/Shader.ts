import UniformBuffer from './UniformBuffer';

export interface UniformInUniformBlock {
	readonly type: number;
	readonly count: number;
	readonly offset: number;
	readonly arrayStride: number;
	readonly matrixStride: number;
}

export interface UniformBlockInfo {
	readonly index: number;
	readonly size: number;
	readonly uniformsIndices: Uint32Array;
	readonly uniforms: Map<string, UniformInUniformBlock>;
	readonly inVertex: boolean;
	readonly inFragment: boolean;
}

export interface UniformInfo {
	readonly type: number;
	readonly count: number;
	readonly location: WebGLUniformLocation;
}


export class Shader {
	private static ctx: WebGL2RenderingContext;
	public static init = (context: WebGL2RenderingContext): void => { Shader.ctx = context; }


	private id: WebGLProgram = 0;

	private readonly uniforms = new Map<string, UniformInfo>();
	private readonly uniformBlocks = new Map<string, UniformBlockInfo>();

	constructor(shaderSource: string) {
		const sources = this.preProcess(shaderSource);

		this.compile(sources);

		this.queryUniformBlockInfos();
		this.queryUniformsInfos();
	}

	public bind = (): void => { Shader.ctx.useProgram(this.id); }
	public delete = (): void => { Shader.ctx.deleteProgram(this.id); }

	public getUniformBlocksInfo = (): Map<string, UniformBlockInfo> => this.uniformBlocks;
	public getUniformsInfo = (): Map<string, UniformInfo> => this.uniforms;

	public uploadUniformFloat = (name: string, float: Float32Array | number[]): void => {
		Shader.ctx.uniform1fv(this.uniforms.get(name)?.location as WebGLUniformLocation, float);
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

	public uploadUniformInt = (name: string, int: Int32Array | number[]): void => {
		Shader.ctx.uniform1iv(this.uniforms.get(name)?.location as WebGLUniformLocation, int);
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

	public uploadUniformUInt = (name: string, uint: Uint32Array | number[]): void => {
		Shader.ctx.uniform1uiv(this.uniforms.get(name)?.location as WebGLUniformLocation, uint);
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

	public uploadUniformBool = (name: string, bool: Uint32Array | boolean[]): void => {
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

	public uploadUniformBuffer = (name: string, uniformBuffer: UniformBuffer): void => {
		const blockInfo = this.uniformBlocks.get(name) as UniformBlockInfo;
		uniformBuffer.bind();
		Shader.ctx.bindBufferBase(Shader.ctx.UNIFORM_BUFFER, blockInfo.index, uniformBuffer.id);
	}


	private preProcess = (source: string): Map<GLenum, string> => {
		const vertexType = /^#vertex/igm;
		const fragmentType = /^#fragment/igm;

		const vertexStartIndice = vertexType.exec(source)?.index as number;
		const fragmentStartIndice = fragmentType.exec(source)?.index as number;

		const vertex = source.slice(vertexStartIndice, fragmentStartIndice);
		const fragment = source.slice(fragmentStartIndice);

		// remove the flag (#vertex || #fragment) and jump to next line
		let vertexSource = vertex.slice(vertex.indexOf('\n') + 1).trimLeft();
		let fragmentSource = fragment.slice(fragment.indexOf('\n') + 1).trimLeft();

		// remove spaces and break lines until the first non null character
		while (vertexSource.indexOf('\n') === 0) {
			vertexSource = vertexSource.slice(1).trimLeft();
		}
		while (fragmentSource.indexOf('\n') === 0) {
			fragmentSource = fragmentSource.slice(1).trimLeft();
		}

		return new Map([
			[Shader.ctx.VERTEX_SHADER, vertexSource],
			[Shader.ctx.FRAGMENT_SHADER, fragmentSource]
		]);
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

	private queryUniformsInUniformBlock = (uniformIndices: number[]): Map<string, UniformInUniformBlock> => {
		const types = Shader.ctx.getActiveUniforms(this.id, uniformIndices, Shader.ctx.UNIFORM_TYPE);
		const count = Shader.ctx.getActiveUniforms(this.id, uniformIndices, Shader.ctx.UNIFORM_SIZE);
		const offsets = Shader.ctx.getActiveUniforms(this.id, uniformIndices, Shader.ctx.UNIFORM_OFFSET);
		const arrayStrides = Shader.ctx.getActiveUniforms(this.id, uniformIndices, Shader.ctx.UNIFORM_ARRAY_STRIDE);
		const matrixStrides = Shader.ctx.getActiveUniforms(this.id, uniformIndices, Shader.ctx.UNIFORM_MATRIX_STRIDE);

		const uniforms = new Map<string, UniformInUniformBlock>();

		uniformIndices.forEach((indice, i) => {
			const name = Shader.ctx.getActiveUniform(this.id, indice)?.name as string;

			uniforms.set(name, {
				type: types[i],
				count: count[i],
				offset: offsets[i],
				arrayStride: arrayStrides[i],
				matrixStride: matrixStrides[i]
			});
		});

		return uniforms;
	}

	private queryUniformBlockInfos = (): void => {
		const uniformBlockCount = Shader.ctx.getProgramParameter(this.id, Shader.ctx.ACTIVE_UNIFORM_BLOCKS);

		for (let blockIndex = 0; blockIndex < uniformBlockCount; blockIndex++) {
			Shader.ctx.uniformBlockBinding(this.id, blockIndex, blockIndex);

			const size = Shader.ctx.getActiveUniformBlockParameter(this.id, blockIndex, Shader.ctx.UNIFORM_BLOCK_DATA_SIZE);
			const uniformsIndices = Shader.ctx.getActiveUniformBlockParameter(this.id, blockIndex, Shader.ctx.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES) as Uint32Array;

			const uniforms = this.queryUniformsInUniformBlock(uniformsIndices as unknown as number[]);

			this.uniformBlocks.set(Shader.ctx.getActiveUniformBlockName(this.id, blockIndex) as string, {
				index: blockIndex,
				size,
				uniformsIndices,
				uniforms,
				inVertex: Shader.ctx.getActiveUniformBlockParameter(this.id, blockIndex, Shader.ctx.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER),
				inFragment: Shader.ctx.getActiveUniformBlockParameter(this.id, blockIndex, Shader.ctx.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER)
			});
		}
	}

	private queryUniformsInfos = (): void => {
		const uniformCount = Shader.ctx.getProgramParameter(this.id, Shader.ctx.ACTIVE_UNIFORMS);

		for (let i = 0; i < uniformCount; i++) {
			const uniform = Shader.ctx.getActiveUniform(this.id, i) as WebGLActiveInfo;
			const location = Shader.ctx.getUniformLocation(this.id, uniform.name) as WebGLUniformLocation;

			if (location)
				this.uniforms.set(uniform.name, { type: uniform.type, location, count: uniform.size });
		}
	}
}


export default Shader;
