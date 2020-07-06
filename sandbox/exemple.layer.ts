import Layer from '@engine/Layer';
import { TypedEvents } from '@engine/Events/Events';

class ExempleLayer extends Layer {
	constructor() {
		super();
	}

	onAttach = (): void => {
		console.log('exemple layer attached');
	}

	onDetach = (): void => {
		console.log('exemple layer detached');
	}

	onUpdate = (deltaTime: number): void => {
		console.log('exemple layer update', deltaTime);
	}

	onEvent = (e: TypedEvents): void => {
		console.log(e);
	}
}

export default ExempleLayer;
