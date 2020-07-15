import BufferLayout from './BufferLayout';


class VertexBuffer {
	private static ctx: WebGL2RenderingContext;

	public static init = (context: WebGL2RenderingContext): void => { VertexBuffer.ctx = context; }


	private readonly id: WebGLBuffer;
	private layout: BufferLayout;

	constructor(size: number, data?: ArrayBufferView, offset: GLuint = 0, length: GLuint = 0) {
		this.id = VertexBuffer.ctx.createBuffer() as WebGLBuffer;

		VertexBuffer.ctx.bindBuffer(VertexBuffer.ctx.ARRAY_BUFFER, this.id);

		if (data)
			VertexBuffer.ctx.bufferData(VertexBuffer.ctx.ARRAY_BUFFER, data, VertexBuffer.ctx.STATIC_DRAW, offset, length);
		else
			VertexBuffer.ctx.bufferData(VertexBuffer.ctx.ARRAY_BUFFER, size, VertexBuffer.ctx.DYNAMIC_DRAW);

		this.layout = new BufferLayout([]);
	}

	public setData = (data: ArrayBufferView, destOffset = 0, srcOffset = 0, length = 0): void => {
		VertexBuffer.ctx.bindBuffer(VertexBuffer.ctx.ARRAY_BUFFER, this.id);

		VertexBuffer.ctx.bufferSubData(VertexBuffer.ctx.ARRAY_BUFFER, destOffset, data, srcOffset, length);
	}

	public getLayout = (): BufferLayout => this.layout;
	public setLayout = (layout: BufferLayout): void => { this.layout = layout; }

	public bind = (): void => { VertexBuffer.ctx.bindBuffer(VertexBuffer.ctx.ARRAY_BUFFER, this.id); }
	public delete = (): void => { VertexBuffer.ctx.deleteBuffer(this.id); }
}


export default VertexBuffer;
