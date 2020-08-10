import VertexBuffer from './VertexBuffer';
import IndexBuffer, { IndexBufferType } from './IndexBuffer';
import { ShaderDataType } from './BufferLayout';


class VertexArray {
	private static ctx: WebGL2RenderingContext;
	public static init = (context: WebGL2RenderingContext): void => { VertexArray.ctx = context; }

	private static shaderDataTypeToWebGLType = (type: ShaderDataType): number => {
		switch (type) {
			case ShaderDataType.Float:      return VertexArray.ctx.FLOAT;
			case ShaderDataType.Float2:     return VertexArray.ctx.FLOAT;
			case ShaderDataType.Float3:     return VertexArray.ctx.FLOAT;
			case ShaderDataType.Float4:     return VertexArray.ctx.FLOAT;
			case ShaderDataType.Int:        return VertexArray.ctx.INT;
			case ShaderDataType.Int2:       return VertexArray.ctx.INT;
			case ShaderDataType.Int3:       return VertexArray.ctx.INT;
			case ShaderDataType.Int4:       return VertexArray.ctx.INT;
			case ShaderDataType.Mat3:       return VertexArray.ctx.FLOAT;
			case ShaderDataType.Mat4:       return VertexArray.ctx.FLOAT;
			case ShaderDataType.Bool:       return VertexArray.ctx.BOOL;
		}

		return 0;
	}


	private readonly id: WebGLVertexArrayObject;

	private vertexBuffers: VertexBuffer[];
	private vertexBufferIndex: number;
	private indexBuffer?: IndexBuffer<IndexBufferType>;

	constructor() {
		this.id = VertexArray.ctx.createVertexArray() as WebGLVertexArrayObject;

		this.vertexBuffers = [];
		this.vertexBufferIndex = 0;
	}

	public addVertexBuffer = (vertexBuffer: VertexBuffer): void => {
		VertexArray.ctx.bindVertexArray(this.id);
		vertexBuffer.bind();

		const layout = vertexBuffer.getLayout();
		layout.forEach(element => {
			switch (element.type) {
				case ShaderDataType.Mat3:
				case ShaderDataType.Mat4: {
					const count = element.componentCount;

					for (let i = 1; i <= count; i++) {
						VertexArray.ctx.enableVertexAttribArray(this.vertexBufferIndex);
						VertexArray.ctx.vertexAttribPointer(this.vertexBufferIndex,
							count,
							VertexArray.shaderDataTypeToWebGLType(element.type),
							element.normalized,
							layout.stride,
							element.offset - (count * 4 * i));

						this.vertexBufferIndex++;
					}
					break;
				}

				default: {
					VertexArray.ctx.enableVertexAttribArray(this.vertexBufferIndex);
					VertexArray.ctx.vertexAttribPointer(this.vertexBufferIndex,
						element.componentCount,
						VertexArray.shaderDataTypeToWebGLType(element.type),
						element.normalized,
						layout.stride,
						element.offset);

					this.vertexBufferIndex++;
					break;
				}
			}
		});

		this.vertexBuffers.push(vertexBuffer);
	}

	public getIndexBuffer = (): IndexBuffer<IndexBufferType> => this.indexBuffer as IndexBuffer<IndexBufferType>;
	public setIndexBuffer = <T extends IndexBufferType>(indexBuffer: IndexBuffer<T>): void => {
		VertexArray.ctx.bindVertexArray(this.id);
		this.indexBuffer = indexBuffer as IndexBuffer<IndexBufferType>;
		this.indexBuffer.bind();
	}

	public bind = (): void => {
		VertexArray.ctx.bindVertexArray(this.id);
		this.indexBuffer?.bind();
	}
	public delete = (): void => { VertexArray.ctx.deleteVertexArray(this.id); }
}


export default VertexArray;
