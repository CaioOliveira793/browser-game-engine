class IndexBuffer {
	private static ctx: WebGL2RenderingContext;

	public static init = (context: WebGL2RenderingContext): void => { IndexBuffer.ctx = context; }


	private readonly id: WebGLBuffer;

	constructor(indices: BufferSource) {
		this.id = IndexBuffer.ctx.createBuffer() as WebGLBuffer;

		IndexBuffer.ctx.bindBuffer(IndexBuffer.ctx.ARRAY_BUFFER, this.id);
		IndexBuffer.ctx.bufferData(IndexBuffer.ctx.ARRAY_BUFFER, indices, IndexBuffer.ctx.STATIC_DRAW);
	}

	public bind = (): void => { IndexBuffer.ctx.bindBuffer(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, this.id); }

	public delete = (): void => { IndexBuffer.ctx.deleteBuffer(this.id); }
}


export default IndexBuffer;
