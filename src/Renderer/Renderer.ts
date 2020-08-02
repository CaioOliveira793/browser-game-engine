import { mat4 as Mat4 } from 'gl-matrix';
import RendererCommand from './RendererCommand';
import VertexArray from './VertexArray';
import UniformBuffer from './UniformBuffer';
import { OrthographicCamera, PerspectiveCamera } from './Camera';
import Shader from './Shader';


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
	private static aspectRatio: number;

	private static sceneData = new SceneData(Mat4.create());
	private static uniformBufferSceneData: UniformBuffer;

	public static init = (context: WebGL2RenderingContext): void => {
		RendererCommand.init(context);
	}

	public static beginScene = (camera: OrthographicCamera | PerspectiveCamera): void => {
		Renderer.sceneData = new SceneData(camera.getViewProjectionMatrix());
		if (!Renderer.uniformBufferSceneData)
			Renderer.uniformBufferSceneData = new UniformBuffer(Renderer.sceneData.buffer.byteLength);

		Renderer.uniformBufferSceneData.setData(Renderer.sceneData.buffer);
	}

	public static endScene = (): void => {
		// finish the scene and draw everything
		// Renderer.uniformBufferSceneData.delete();
	}

	public static submit = (shader: Shader, vertexArray: VertexArray, transform = Mat4.create()): void => {
		shader.uploadUniformBuffer('ub_Scene', Renderer.uniformBufferSceneData);
		shader.uploadUniformMat4('u_Transform', transform);
		RendererCommand.drawIndexed(vertexArray);
	}

	public static onScreenResize = (width: number, height: number): void => {
		RendererCommand.setViewport();
		Renderer.aspectRatio = width / height;
	}

	public static getAspectRatio = (): number => Renderer.aspectRatio;
}


export default Renderer;
