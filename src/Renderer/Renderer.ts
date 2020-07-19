import { mat4 as Mat4 } from 'gl-matrix';
import RendererCommand from './RendererCommand';
import Shader from './Shader';
import VertexArray from './VertexArray';
import { OrthographicCamera } from './Camera';


class Renderer {
	private static aspectRatio: number;
	private static viewProjectionMatrix: Mat4;

	public static init = (context: WebGL2RenderingContext): void => {
		RendererCommand.init(context);
	}

	public static beginScene = (camera: OrthographicCamera): void => {
		Renderer.viewProjectionMatrix = camera.getViewProjectionMatrix();
	}

	public static endScene = (): void => {
		// finish the scene and draw everything
	}

	public static submit = (shader: Shader, vertexArray: VertexArray, transform = Mat4.create()): void => {
		shader.bind();
		shader.uploadUniformMat4('u_viewProjection', Renderer.viewProjectionMatrix);
		shader.uploadUniformMat4('u_transform', transform);
		RendererCommand.drawIndexed(shader, vertexArray);
	}

	public static onScreenResize = (width: number, height: number): void => {
		RendererCommand.setViewport();
		Renderer.aspectRatio = width / height;
	}

	public static getAspectRatio = (): number => Renderer.aspectRatio;
}


export default Renderer;
