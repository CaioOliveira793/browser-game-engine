import { TypedEvents } from './Events/Events';


export abstract class Layer {
	public abstract onAttach: () => void;
	public abstract onDetach: () => void;

	public abstract onUpdate: (deltaTime: number) => void;

	public abstract onEvent: (e: TypedEvents) => void;
}

export default Layer;
