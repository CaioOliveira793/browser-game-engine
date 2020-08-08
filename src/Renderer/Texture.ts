type TextureType = Float32Array | Uint8ClampedArray | Uint8Array | Uint16Array | ImageBitmap;


export class Texture2D {
	public static ctx: WebGL2RenderingContext;
	public static init = (context: WebGL2RenderingContext): void => { Texture2D.ctx = context; }


	public readonly id: WebGLTexture;

	private dataFormat = Texture2D.ctx.RGBA;
	private type = Texture2D.ctx.FLOAT;

	private width: number;
	private height: number;
	private internalFormat = Texture2D.ctx.RGBA;
	private border = 0;
	private level = 0;

	constructor(width: number, height: number, channels: number, type: new (length: number) => TextureType, data?: TextureType) {
		const texture = data ?? new type(width * height * channels);

		this.width = width;
		this.height = height;

		if (texture instanceof Uint8Array || texture instanceof Uint8ClampedArray) {
			this.type = Texture2D.ctx.UNSIGNED_BYTE;

			this.internalFormat = (channels === 4) ? Texture2D.ctx.RGBA8 : Texture2D.ctx.RGB8;
			this.dataFormat = (channels === 4) ? Texture2D.ctx.RGBA : Texture2D.ctx.RGB;
		} else if (texture instanceof Uint16Array) {
			this.type = Texture2D.ctx.UNSIGNED_SHORT;

			this.internalFormat = (channels === 4) ? Texture2D.ctx.RGBA16UI : Texture2D.ctx.RGB16UI;
			this.dataFormat = (channels === 4) ? Texture2D.ctx.RGBA_INTEGER : Texture2D.ctx.RGB_INTEGER;
		} else if (texture instanceof Float32Array) {
			this.type = Texture2D.ctx.FLOAT;

			this.internalFormat = (channels === 4) ? Texture2D.ctx.RGBA32F : Texture2D.ctx.RGB32F;
			this.dataFormat = (channels === 4) ? Texture2D.ctx.RGBA : Texture2D.ctx.RGB;
		}

		this.id = Texture2D.ctx.createTexture() as WebGLTexture;
		Texture2D.ctx.bindTexture(Texture2D.ctx.TEXTURE_2D, this.id);

		if (texture instanceof ImageBitmap)
			Texture2D.ctx.texImage2D(Texture2D.ctx.TEXTURE_2D, this.level, this.internalFormat, this.dataFormat, this.type, texture);
		else
			Texture2D.ctx.texImage2D(Texture2D.ctx.TEXTURE_2D, this.level, this.internalFormat, this.width, this.height, this.border, this.dataFormat, this.type, texture);

		Texture2D.ctx.texParameteri(Texture2D.ctx.TEXTURE_2D, Texture2D.ctx.TEXTURE_MIN_FILTER, Texture2D.ctx.NEAREST);
		Texture2D.ctx.texParameteri(Texture2D.ctx.TEXTURE_2D, Texture2D.ctx.TEXTURE_MAG_FILTER, Texture2D.ctx.NEAREST);
		Texture2D.ctx.texParameteri(Texture2D.ctx.TEXTURE_2D, Texture2D.ctx.TEXTURE_WRAP_S, Texture2D.ctx.CLAMP_TO_EDGE);
		Texture2D.ctx.texParameteri(Texture2D.ctx.TEXTURE_2D, Texture2D.ctx.TEXTURE_WRAP_T, Texture2D.ctx.CLAMP_TO_EDGE);
		Texture2D.ctx.texParameteri(Texture2D.ctx.TEXTURE_2D, Texture2D.ctx.TEXTURE_WRAP_R, Texture2D.ctx.CLAMP_TO_EDGE);
	}

	public bind = (textureSlot = 0): void => {
		Texture2D.ctx.activeTexture(Texture2D.ctx.TEXTURE0 + textureSlot);
		Texture2D.ctx.bindTexture(Texture2D.ctx.TEXTURE_2D, this.id);
	}
	public delete = (): void => { Texture2D.ctx.deleteTexture(this.id); }

	public upload = (texture: TextureType): void => {
		Texture2D.ctx.bindTexture(Texture2D.ctx.TEXTURE_2D, this.id);
		if (texture instanceof ImageBitmap)
			Texture2D.ctx.texSubImage2D(Texture2D.ctx.TEXTURE_2D, this.level, 0, 0, this.dataFormat, this.type, texture);
		else
			Texture2D.ctx.texSubImage2D(Texture2D.ctx.TEXTURE_2D, this.level, 0, 0, this.width, this.height, this.dataFormat, this.type, texture);
	}

	public uploadSubRectangle = (data: TextureType, xTextelOffset: number, yTextelOffset: number, width: number, height: number): void => {
		Texture2D.ctx.bindTexture(Texture2D.ctx.TEXTURE_2D, this.id);
		Texture2D.ctx.texSubImage2D(Texture2D.ctx.TEXTURE_2D, this.level, xTextelOffset, yTextelOffset, width, height, this.dataFormat, this.type, data as TexImageSource);
	}
}


export default Texture2D;
