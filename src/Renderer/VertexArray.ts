import VertexBuffer from './VertexBuffer';
import IndexBuffer from './IndexBuffer';
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
	private indexBuffer?: IndexBuffer;

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
				case ShaderDataType.Float:
				case ShaderDataType.Float2:
				case ShaderDataType.Float3:
				case ShaderDataType.Float4:
				case ShaderDataType.Int:
				case ShaderDataType.Int2:
				case ShaderDataType.Int3:
				case ShaderDataType.Int4:
				case ShaderDataType.Bool: {
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
				}
			}
		});

		this.vertexBuffers.push(vertexBuffer);
	}

	public getIndexBuffer = (): IndexBuffer => this.indexBuffer as IndexBuffer;
	public setIndexBuffer = (indexBuffer: IndexBuffer): void => {
		VertexArray.ctx.bindVertexArray(this.id);
		this.indexBuffer = indexBuffer;
		this.indexBuffer.bind();
	}

	public bind = (): void => {
		VertexArray.ctx.bindVertexArray(this.id);
		this.indexBuffer?.bind();
	}
	public delete = (): void => { VertexArray.ctx.deleteVertexArray(this.id); }
}


export default VertexArray;
