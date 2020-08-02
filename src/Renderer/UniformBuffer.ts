class UniformBuffer {
	private static ctx: WebGL2RenderingContext;
	public static init = (context: WebGL2RenderingContext): void => { UniformBuffer.ctx = context; }


	public readonly id: WebGLBuffer;

	constructor(size: number, data?: BufferSource) {
		this.id = UniformBuffer.ctx.createBuffer() as WebGLBuffer;

		UniformBuffer.ctx.bindBuffer(UniformBuffer.ctx.UNIFORM_BUFFER, this.id);

		if (data)
			UniformBuffer.ctx.bufferData(UniformBuffer.ctx.UNIFORM_BUFFER, data, UniformBuffer.ctx.STATIC_DRAW);
		else
			UniformBuffer.ctx.bufferData(UniformBuffer.ctx.UNIFORM_BUFFER, size, UniformBuffer.ctx.DYNAMIC_DRAW);
	}

	public setData = (data: BufferSource, destOffset = 0): void => {
		UniformBuffer.ctx.bindBuffer(UniformBuffer.ctx.UNIFORM_BUFFER, this.id);
		UniformBuffer.ctx.bufferSubData(UniformBuffer.ctx.UNIFORM_BUFFER, destOffset, data);
	}

	public bind = (): void => { UniformBuffer.ctx.bindBuffer(UniformBuffer.ctx.UNIFORM_BUFFER, this.id); }
	public delete = (): void => { UniformBuffer.ctx.deleteBuffer(this.id); }
}


export default UniformBuffer;
