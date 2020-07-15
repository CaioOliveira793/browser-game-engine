class IndexBuffer {
	private static ctx: WebGL2RenderingContext;

	public static init = (context: WebGL2RenderingContext): void => { IndexBuffer.ctx = context; }


	private readonly id: WebGLBuffer;

	private readonly count: number;
	private readonly type: GLenum = 0;
	private readonly indiceSize: number = 0;

	constructor(indices: Uint8Array | Uint16Array | Uint32Array) {
		this.id = IndexBuffer.ctx.createBuffer() as WebGLBuffer;

		IndexBuffer.ctx.bindBuffer(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, this.id);
		IndexBuffer.ctx.bufferData(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, indices, IndexBuffer.ctx.STATIC_DRAW);

		this.count = indices.length;

		if (indices instanceof Uint8Array) {
			this.type = IndexBuffer.ctx.UNSIGNED_BYTE;
			this.indiceSize = 1;
		} else if (indices instanceof Uint16Array) {
			this.type = IndexBuffer.ctx.UNSIGNED_SHORT;
			this.indiceSize = 2;
		} else if (indices instanceof Uint32Array) {
			this.type = IndexBuffer.ctx.UNSIGNED_INT;
			this.indiceSize = 4;
		}
	}

	public getCount = (): number => this.count;
	public getIndiceSize = (): number => this.indiceSize;
	public getType = (): number => this.type;

	public bind = (): void => { IndexBuffer.ctx.bindBuffer(IndexBuffer.ctx.ELEMENT_ARRAY_BUFFER, this.id); }
	public delete = (): void => { IndexBuffer.ctx.deleteBuffer(this.id); }
}


export default IndexBuffer;
