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
	public readonly quadVertexArray: VertexArray;
	public readonly quadShader: Shader;
	public readonly blankTexture: Texture2D;

	constructor() {
		this.quadVertexArray = new VertexArray();
		this.quadShader = new Shader(texture2DSource);
		this.blankTexture = new Texture2D(1, 1, 4, Uint8ClampedArray, new Uint8ClampedArray([255, 255, 255, 255]));

		const vBuffer = new Float32Array([
			-1.0, -1.0, 0.0, 0.0, 0.0, 1.0, // 0
			1.0,  -1.0, 0.0, 1.0, 0.0, 1.0, // 1
			1.0,   1.0, 0.0, 1.0, 1.0, 1.0, // 2
			-1.0,  1.0, 0.0, 0.0, 1.0, 1.0, // 3
		]);

		const vertexBuffer = new VertexBuffer(vBuffer.length, vBuffer);
		vertexBuffer.setLayout(new BufferLayout([
			{ type: ShaderDataType.Float3 },
			{ type: ShaderDataType.Float2 },
			{ type: ShaderDataType.Float },
		]));

		this.quadVertexArray.addVertexBuffer(vertexBuffer);
		this.quadVertexArray.setIndexBuffer(new IndexBuffer(new Uint8Array([0, 1, 2, 3, 0, 2])));
	}

	public delete = (): void => {
		this.quadVertexArray.delete();
		this.quadShader.delete();
		this.blankTexture.delete();
	}
}


class Renderer2D {
	public static init = (): void => {
		Renderer2D.data = new Renderer2DData();
		Renderer2D.sceneData = new SceneData(Mat4.create());
		Renderer2D.sceneDataUBuffer = new UniformBuffer(Renderer2D.sceneData.buffer.byteLength);
		Renderer2D.materialUBuffer = new UniformBuffer(32 * 1);
	}
	public static shutdown = (): void => {
		Renderer2D.data.delete();
		Renderer2D.sceneDataUBuffer.delete();
		Renderer2D.materialUBuffer.delete();
	}


	public static beginScene = (camera: OrthographicCamera | PerspectiveCamera): void => {
		Renderer2D.sceneData = new SceneData(camera.getViewProjectionMatrix());
		Renderer2D.sceneDataUBuffer.setData(Renderer2D.sceneData.buffer);
		Renderer2D.data.quadShader.bind();
		Renderer2D.data.quadShader.uploadUniformBuffer('ub_Scene', Renderer2D.sceneDataUBuffer);
	}
	public static endScene = (): void => {
		///////////////////////////////////////////
	}


	public static drawColorQuad = (position: Vec2 | Vec3, size: Vec2, rotation: number, color: Vec4): void => {
		const transform = Mat4.create();
		Mat4.translate(transform, transform, Vec3.fromValues(position[0], position[1], position[2] ?? 0));
		Mat4.rotateZ(transform, transform, glMatrix.toRadian(rotation));
		Mat4.scale(transform, transform, Vec3.fromValues(size[0], size[1], 1));

		Renderer2D.drawQuad(transform, Renderer2D.data.blankTexture, color);
	}

	public static drawTexQuad = (position: Vec2 | Vec3, size: Vec2, rotation: number, texture: Texture2D, tintColor = Vec4.fromValues(1.0, 1.0, 1.0, 1.0)): void => {
		const transform = Mat4.create();
		Mat4.translate(transform, transform, Vec3.fromValues(position[0], position[1], position[2] ?? 0));
		Mat4.rotateZ(transform, transform, glMatrix.toRadian(rotation));
		Mat4.scale(transform, transform, Vec3.fromValues(size[0], size[1], 1));

		Renderer2D.drawQuad(transform, texture, tintColor);
	}

	private static drawQuad = (transform: Mat4, texture: Texture2D, tintColor: Vec4): void => {
		const size = 32;
		const elements = 1;
		for (let i = 0; i < elements; i++) {
			Renderer2D.materialUBuffer.setData(new Float32Array(tintColor), i * size + 0);
			Renderer2D.materialUBuffer.setData(new Int8Array([0]), i * size + 16);
			Renderer2D.materialUBuffer.setData(new Float32Array([1.0]), i * size + 20);
		}

		const textureSlot = 0;
		texture.bind(textureSlot);

		Renderer2D.data.quadShader.bind();
		Renderer2D.data.quadShader.uploadUniformMat4('u_Transform[0]', transform);
		Renderer2D.data.quadShader.uploadUniformInt('u_Texture[0]', [textureSlot]);
		Renderer2D.data.quadShader.uploadUniformBuffer('ub_Material', Renderer2D.materialUBuffer);

		RendererCommand.drawIndexed(Renderer2D.data.quadVertexArray);
	}



	private static data: Renderer2DData;

	private static sceneData: SceneData;
	private static sceneDataUBuffer: UniformBuffer;
	private static materialUBuffer: UniformBuffer;
}


export default Renderer2D;
