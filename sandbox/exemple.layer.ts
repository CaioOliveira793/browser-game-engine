import Layer from '@engine/Layer';
import { TypedEvents } from '@engine/Events/Events';

class ExempleLayer extends Layer {
	public onAttach = (): void => {/* */}

	public onDetach = (): void => {/* */}

	public onUpdate = (deltaTime: number): void => {/* */}

	public onKeyboardEvent = (e: TypedEvents): void => {/* */}

	public onMouseEvent = (e: TypedEvents): void => {/* */}

	public onScreenEvent = (e: TypedEvents): void => {/* */}
}

export default ExempleLayer;
