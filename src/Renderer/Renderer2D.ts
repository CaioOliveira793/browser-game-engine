import { mat4 as Mat4, vec2 as Vec2, vec3 as Vec3, vec4 as Vec4, glMatrix } from 'gl-matrix';

import RendererCommand from './RendererCommand';

import VertexArray from './VertexArray';
import VertexBuffer from './VertexBuffer';
import IndexBuffer from './IndexBuffer';
import BufferLayout, { ShaderDataType } from './BufferLayout';
import UniformBuffer from './UniformBuffer';
import Shader from './Shader';
import Texture2D from './Texture';

import texture2DSource from './Materials/Shaders/Texture2D.glsl';

import { OrthographicCamera, PerspectiveCamera } from './Camera';


interface Statistics {
	draws: number;
	geometries: number;
	reset: () => void;
}


class SceneData {
	public readonly viewProjectionMatrix: Mat4;

	public readonly buffer: ArrayBuffer;

	constructor(viewProjectionMatrix: Mat4) {
		this.viewProjectionMatrix = viewProjectionMatrix;

		const size = this.viewProjectionMatrix.length * 4;
		this.buffer = new ArrayBuffer(size);
		(new Float32Array(this.buffer)).set(this.viewProjectionMatrix);
	}
}


class Renderer2DData {
	public readonly maxGeometries: number;
	public readonly maxVertices: number;
	public readonly maxIndices: number;
	public readonly maxTextureSlots: number;

	public readonly elementsPerVertice: number;

	// index of vertex:
	public verticeIndex: number;

	public indexCount: number;
	public vertexCount: number;
	public textureCount: number;
	public geometryCount: number

	private readonly vertexBufferData: Float32Array;
	private readonly indexBufferData: Uint16Array;
	private readonly geometryMaterialData: ArrayBuffer;
	private readonly transformData: Float32Array;

	public readonly vertexArray: VertexArray;
	public readonly vertexBuffer: VertexBuffer;
	public readonly indexBuffer: IndexBuffer<Uint16Array>;
	public readonly shader: Shader;
	public readonly textures: Texture2D[];
	public readonly blankTexture: Texture2D;
	public readonly geometryMaterial: UniformBuffer;

	constructor() {
		this.elementsPerVertice = 6;

		this.maxGeometries = 1024;
		this.maxVertices = this.maxGeometries * this.elementsPerVertice * 4; // 4 = only drawing quads for now
		this.maxIndices = this.maxGeometries * 6;                            // 6 =           ||
		this.maxTextureSlots = 8;

		this.verticeIndex = 0;

		this.indexCount = 0;
		this.vertexCount = 0;
		this.textureCount = 0;
		this.geometryCount = 0;

		this.vertexBufferData = new Float32Array(this.maxVertices);
		this.indexBufferData = new Uint16Array(this.maxIndices);

		// uniform buffer needs to be the same size used in the shader
		this.geometryMaterialData = new ArrayBuffer(32 * 1024); // 32 = UB byteLength * 1024 = UB length  // exe: UB[1024]
		this.transformData = new Float32Array(this.maxGeometries * 16);

		this.geometryMaterial = new UniformBuffer(this.geometryMaterialData.byteLength);
		this.vertexArray = new VertexArray();
		this.vertexBuffer = new VertexBuffer(this.vertexBufferData.byteLength);
		this.indexBuffer = new IndexBuffer(this.indexBufferData.byteLength, this.indexBufferData.BYTES_PER_ELEMENT as 1 | 2 | 4);

		this.vertexBuffer.setLayout(new BufferLayout([
			{ type: ShaderDataType.Float3 },
			{ type: ShaderDataType.Float2 },
			{ type: ShaderDataType.Float },
		]));
		this.vertexArray.addVertexBuffer(this.vertexBuffer);
		this.vertexArray.setIndexBuffer(this.indexBuffer);

		this.shader = new Shader(texture2DSource);
		this.blankTexture = new Texture2D(1, 1, 4, Uint8ClampedArray, new Uint8ClampedArray([255, 255, 255, 255]));
		this.textures = [this.blankTexture];
	}

	public addGeometry = (vertexData: Float32Array, indexData: Uint16Array, transform: Mat4, material: Float32Array): void => {
		this.vertexBufferData.set(vertexData, this.vertexCount);
		this.indexBufferData.set(indexData, this.indexCount);
		this.transformData.set(transform, this.geometryCount * 16); // 16 = offset length

		(new Float32Array(this.geometryMaterialData)).set(material, this.geometryCount * 8); // 8 = offset length

		this.verticeIndex += vertexData.length / this.elementsPerVertice;

		this.vertexCount += vertexData.length;
		this.indexCount += indexData.length;
		this.geometryCount += 1;
	}

	public addTexture = (texture: Texture2D): number => {
		for (let i = 0; i < this.textureCount; i++)
			if (this.textures[i].id === texture.id) return i;

		this.textures[this.textureCount] = texture;
		return this.textureCount++;
	}

	public reset = (): void => {
		for (let i = 0; i < this.textureCount; i++) this.textures.pop();
		this.verticeIndex = 0;

		this.vertexCount = 0;
		this.indexCount = 0;
		this.textureCount = 0;
		this.geometryCount = 0;
	}

	public upload = (): void => {
		this.vertexBuffer.setData(this.vertexBufferData);
		this.indexBuffer.setData(this.indexBufferData);
		this.geometryMaterial.setData(this.geometryMaterialData);

		for (let i = 0; i < this.textureCount; i++) {
			this.textures[i].bind(i);
		}

		this.shader.bind();
		this.shader.uploadInt('u_Texture[0]', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
		this.shader.uploadMat4('u_Transform[0]', this.transformData);
		this.shader.uploadBuffer('ub_Material', this.geometryMaterial);
	}

	public delete = (): void => {
		this.vertexArray.delete();
		this.vertexBuffer.delete();
		this.indexBuffer.delete();
		this.shader.delete();
		this.blankTexture.delete();
		this.geometryMaterial.delete();
	}
}


class Renderer2D {
	public static init = (): void => {
		Renderer2D.data = new Renderer2DData();
		Renderer2D.sceneData = new SceneData(Mat4.create());
		Renderer2D.sceneDataUBuffer = new UniformBuffer(Renderer2D.sceneData.buffer.byteLength);

		Renderer2D.stats = {
			draws: 0,
			geometries: 0,
			reset(): void { this.draws = 0; this.geometries = 0; }
		};
	}
	public static shutdown = (): void => {
		Renderer2D.data.delete();
		Renderer2D.sceneDataUBuffer.delete();
	}


	public static beginScene = (camera: OrthographicCamera | PerspectiveCamera): void => {
		Renderer2D.sceneData = new SceneData(camera.getViewProjectionMatrix());
		Renderer2D.sceneDataUBuffer.setData(Renderer2D.sceneData.buffer);
		Renderer2D.data.shader.bind();
		Renderer2D.data.shader.uploadBuffer('ub_Scene', Renderer2D.sceneDataUBuffer);
	}
	public static endScene = (): void => {
		if (Renderer2D.data.geometryCount > 0)
			Renderer2D.flush();
		Renderer2D.stats.reset();
	}


	public static drawColorQuad = (position: Vec2 | Vec3, size: Vec2, rotation: number, color: Vec4): void => {
		const transform = Mat4.create();
		Mat4.translate(transform, transform, Vec3.fromValues(position[0], position[1], position[2] ?? 0));
		Mat4.rotateZ(transform, transform, glMatrix.toRadian(rotation));
		Mat4.scale(transform, transform, Vec3.fromValues(size[0], size[1], 1));

		Renderer2D.drawQuad(transform, Renderer2D.data.blankTexture, color, 1.0);
	}

	public static drawTexQuad = (position: Vec2 | Vec3, size: Vec2, rotation: number, texture: Texture2D,
		tintColor = Vec4.fromValues(1.0, 1.0, 1.0, 1.0), tilingFactor = 1.0): void => {
		const transform = Mat4.create();
		Mat4.translate(transform, transform, Vec3.fromValues(position[0], position[1], position[2] ?? 0));
		Mat4.rotateZ(transform, transform, glMatrix.toRadian(rotation));
		Mat4.scale(transform, transform, Vec3.fromValues(size[0], size[1], 1));

		Renderer2D.drawQuad(transform, texture, tintColor, tilingFactor);
	}

	private static drawQuad = (transform: Mat4, texture: Texture2D, tintColor: Vec4, tilingFactor: number): void => {
		if (Renderer2D.data.geometryCount === Renderer2D.data.maxGeometries ||
			Renderer2D.data.indexCount + 6 > Renderer2D.data.maxIndices ||
			Renderer2D.data.vertexCount + 24 > Renderer2D.data.maxVertices ||
			Renderer2D.data.textureCount + 1 > Renderer2D.data.maxTextureSlots) Renderer2D.flush();

		const textureIndex = Renderer2D.data.addTexture(texture);

		const material = new Float32Array([
			tintColor[0], tintColor[1], tintColor[2], tintColor[3],
			textureIndex, tilingFactor, 0.0,          0.0
		]);

		const vertexData = new Float32Array([
			-.5,  -.5, 0.0, 0.0, 0.0, Renderer2D.data.geometryCount, // 0
			0.5,  -.5, 0.0, 1.0, 0.0, Renderer2D.data.geometryCount, // 1
			0.5,  0.5, 0.0, 1.0, 1.0, Renderer2D.data.geometryCount, // 2
			-.5,  0.5, 0.0, 0.0, 1.0, Renderer2D.data.geometryCount, // 3
		]);

		const indexData = new Uint16Array([
			Renderer2D.data.verticeIndex,
			Renderer2D.data.verticeIndex + 1,
			Renderer2D.data.verticeIndex + 2,
			Renderer2D.data.verticeIndex + 3,
			Renderer2D.data.verticeIndex,
			Renderer2D.data.verticeIndex + 2,
		]);

		Renderer2D.data.addGeometry(vertexData, indexData, transform, material);
		Renderer2D.stats.geometries++;
	}

	public static flush = (): void => {
		Renderer2D.data.upload();
		RendererCommand.drawIndexed(Renderer2D.data.vertexArray, Renderer2D.data.indexCount);
		Renderer2D.data.reset();
		Renderer2D.stats.draws++;
	}

	public static stats: Statistics;


	private static data: Renderer2DData;

	private static sceneData: SceneData;
	private static sceneDataUBuffer: UniformBuffer;
}


export default Renderer2D;
