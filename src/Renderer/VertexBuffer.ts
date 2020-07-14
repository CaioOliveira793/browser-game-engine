import BufferLayout from './BufferLayout';


class VertexBuffer {
	private static ctx: WebGL2RenderingContext;

	public static init = (context: WebGL2RenderingContext): void => { VertexBuffer.ctx = context; }


	private readonly id: WebGLBuffer;
	private layout: BufferLayout;

	constructor(size: number, srcData?: ArrayBufferView, srcOffset: GLuint = 0, length: GLuint = 0) {
		this.id = VertexBuffer.ctx.createBuffer() as WebGLBuffer;

		VertexBuffer.ctx.bindBuffer(VertexBuffer.ctx.ARRAY_BUFFER, this.id);

		if (srcData)
			VertexBuffer.ctx.bufferData(VertexBuffer.ctx.ARRAY_BUFFER, srcData, VertexBuffer.ctx.STATIC_DRAW, srcOffset, length);
		else
			VertexBuffer.ctx.bufferData(VertexBuffer.ctx.ARRAY_BUFFER, size, VertexBuffer.ctx.DYNAMIC_DRAW);

		this.layout = new BufferLayout([]);
	}

	public bind = (): void => { VertexBuffer.ctx.bindBuffer(VertexBuffer.ctx.ARRAY_BUFFER, this.id); }

	public setData = (data: ArrayBufferView, destByteOffset = 0): void => {
		VertexBuffer.ctx.bindBuffer(VertexBuffer.ctx.ARRAY_BUFFER, this.id);

		VertexBuffer.ctx.bufferSubData(VertexBuffer.ctx.ARRAY_BUFFER, destByteOffset, data, 0, 0);
	}

	public getLayout = (): BufferLayout => this.layout;
	public setLayout = (layout: BufferLayout): void => { this.layout = layout; }

	public delete = (): void => { VertexBuffer.ctx.deleteBuffer(this.id); }
}


export default VertexBuffer;
