import { mat4 as Mat4 } from 'gl-matrix';
import RendererCommand from './RendererCommand';
import VertexArray from './VertexArray';
import UniformBuffer from './UniformBuffer';
import { OrthographicCamera, PerspectiveCamera } from './Camera';
import Shader from './Shader';
import Renderer2D from './Renderer2D';


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

class Renderer {
	public static init = (context: WebGL2RenderingContext): void => {
		RendererCommand.init(context);
		Renderer2D.init();

		Renderer.sceneData = new SceneData(Mat4.create());
		Renderer.sceneDataUBuffer = new UniformBuffer(Renderer.sceneData.buffer.byteLength);
	}
	public static shutdown = (): void => {
		Renderer2D.shutdown();
	}

	public static beginScene = (camera: OrthographicCamera | PerspectiveCamera): void => {
		Renderer.sceneData = new SceneData(camera.getViewProjectionMatrix());
		Renderer.sceneDataUBuffer.setData(Renderer.sceneData.buffer);
	}
	public static endScene = (): void => {
		///////////////////////
	}

	public static submit = (shader: Shader, vertexArray: VertexArray, transform = Mat4.create()): void => {
		shader.bind();
		shader.uploadBuffer('ub_Scene', Renderer.sceneDataUBuffer);
		shader.uploadMat4('u_Transform', transform);
		RendererCommand.drawIndexed(vertexArray);
	}


	public static onScreenResize = (width: number, height: number): void => {
		RendererCommand.setViewport();
		Renderer.aspectRatio = width / height;
	}

	public static getAspectRatio = (): number => Renderer.aspectRatio;



	private static sceneData: SceneData;
	private static sceneDataUBuffer: UniformBuffer;

	private static aspectRatio: number;
}


export default Renderer;
