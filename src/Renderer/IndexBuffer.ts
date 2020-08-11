export type IndexBufferType = Uint8Array | Uint16Array | Uint32Array;

class IndexBuffer<T extends IndexBufferType> {
	private static ctx: WebGL2RenderingContext;

	public static init = (context: WebGL2RenderingContext): void => { IndexBuffer.ctx = context; }


	private readonly id: WebGLBuffer;

	public readonly count: number;
	public readonly type: GLenum = 0;
	public readonly indiceSize: 1 | 2 | 4 = 1;

	constructor(size: number, indiceSize: 1 | 2 | 4, data?: T) {
		this.id = IndexBuffer.ctx.createBuffer() as WebGLBuffer;

		IndexBuffer.ctx.bindBuffer(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, this.id);
		if (data)
			IndexBuffer.ctx.bufferData(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, data, IndexBuffer.ctx.STATIC_DRAW);
		else
			IndexBuffer.ctx.bufferData(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, size, IndexBuffer.ctx.DYNAMIC_DRAW);

		this.count = size / indiceSize;

		if (indiceSize === 1) {
			this.type = IndexBuffer.ctx.UNSIGNED_BYTE;
			this.indiceSize = 1;
		} else if (indiceSize === 2) {
			this.type = IndexBuffer.ctx.UNSIGNED_SHORT;
			this.indiceSize = 2;
		} else if (indiceSize === 4) {
			this.type = IndexBuffer.ctx.UNSIGNED_INT;
			this.indiceSize = 4;
		}
	}

	public setData = (data: T, destOffset = 0, srcOffset = 0, length = 0): void => {
		IndexBuffer.ctx.bindBuffer(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, this.id);
		IndexBuffer.ctx.bufferSubData(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, destOffset, data, srcOffset, length);
	}

	public bind = (): void => { IndexBuffer.ctx.bindBuffer(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, this.id); }
	public delete = (): void => { IndexBuffer.ctx.deleteBuffer(this.id); }
}


export default IndexBuffer;
