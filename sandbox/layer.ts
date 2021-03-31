import { vec2, vec3, vec4 } from 'gl-matrix';
import Layer from '@engine/Layer';
import { EventDispatcher, EventType, TypedEvents } from '@engine/Events/Events';
import { OrthographicCameraController } from '@engine/CameraController';
import Renderer2D from '@engine/Renderer/Renderer2D';
import RendererCommand from '@engine/Renderer/RendererCommand';
import { ScreenResizeEvent } from '@engine/Events/ScreenEvents';
import { MouseScrollEvent } from '@engine/Events/MouseEvents';


class ExempleLayer extends Layer {
	private clearColor = vec4.fromValues(0.5, 0.5, 0.5, 1.0);

	private cameraController = new OrthographicCameraController(100, 16 / 9);

	private quadColor = vec4.fromValues(0.95, 0.81, 0.20, 1.0);


	public onAttach = (): void => {
		RendererCommand.setClearColor(this.clearColor);
	}

	public onDetach = (): void => {}

	public onUpdate = (deltaTime: number): void => {
		RendererCommand.clear();
		this.cameraController.onUpdate(deltaTime);

		Renderer2D.beginScene(this.cameraController.getCamera());

		Renderer2D.drawColorQuad(
			vec3.fromValues(0, 0, 0),
			vec2.fromValues(10, 10),
			45,
			this.quadColor
		);

		Renderer2D.endScene();
	}

	public onKeyboardEvent = (e: TypedEvents): void => {/* */}

	public onMouseEvent = (e: TypedEvents): void => {
		const dispatcher = new EventDispatcher(e);
		dispatcher.dispatch(EventType.MouseScroll, (e: MouseScrollEvent) => {
			this.cameraController.onMouseScroll(e);
			return true;
		});
	}

	public onScreenEvent = (e: TypedEvents): void => {
		const dispatcher = new EventDispatcher(e);
		dispatcher.dispatch(EventType.ScreenResize, (e: ScreenResizeEvent) => {
			this.cameraController.onScreenResize(e);
			return false;
		});
	}
}

export default ExempleLayer;
