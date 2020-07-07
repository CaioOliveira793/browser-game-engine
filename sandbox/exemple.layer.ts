import Layer from '@engine/Layer';
import { TypedEvents } from '@engine/Events/Events';

class ExempleLayer extends Layer {
	constructor() {
		super();
	}

	onAttach = (): void => {/* */}

	onDetach = (): void => {/* */}

	onUpdate = (deltaTime: number): void => {/* */}

	onKeyboardEvent = (e: TypedEvents): void => {/* */}

	onMouseEvent = (e: TypedEvents): void => {/* */}

	onScreenEvent = (e: TypedEvents): void => {/* */}
}

export default ExempleLayer;
