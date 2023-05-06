import { vec2, vec4 } from 'gl-matrix';
import Layer from '@engine/Layer';
import { EventDispatcher, EventType, TypedEvents } from '@engine/Events/Events';
import { OrthographicCameraController } from '@engine/CameraController';
import Renderer2D from '@engine/Renderer/Renderer2D';
import RendererCommand from '@engine/Renderer/RendererCommand';
import { ScreenResizeEvent } from '@engine/Events/ScreenEvents';
import { MouseScrollEvent } from '@engine/Events/MouseEvents';


class ExempleLayer extends Layer {
	private readonly clearColor = vec4.fromValues(0.5, 0.5, 0.5, 1.0);

	private readonly cameraController = new OrthographicCameraController(100, 16 / 9);

	private quadColor = vec4.fromValues(0.1, 0.1, 0.20, 1.0);
	private readonly angleVelocity = 45;
	private quadAngle = 45;


	public onAttach = (): void => {
		RendererCommand.setClearColor(this.clearColor);
	}

	public onDetach = (): void => {}

	public onUpdate = (deltaTime: number): void => {
		RendererCommand.clear();
		this.cameraController.onUpdate(deltaTime);

		Renderer2D.beginScene(this.cameraController.getCamera());

		this.quadAngle += this.quadAngle > 360
			? this.angleVelocity * deltaTime - 360
			: this.angleVelocity * deltaTime;
		
		for (let j = 0; j < 10; j++) {
			for (let i = 0; i < 10; i++) {
				this.quadColor[0] = i * 0.1;
				this.quadColor[1] = j * 0.1;

				Renderer2D.drawColorQuad(
					vec2.fromValues(i * 12, j * 12),
					vec2.fromValues(10, 10),
					this.quadAngle,
					this.quadColor
				);
			}
		}

		Renderer2D.endScene();
	}

	public onKeyboardEvent = (_e: TypedEvents): void => {/* */}

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
