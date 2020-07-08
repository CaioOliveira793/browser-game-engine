import { TypedEvents } from './Events/Events';


export abstract class Layer {
	public abstract onAttach: () => void;
	public abstract onDetach: () => void;

	public abstract onUpdate: (deltaTime: number) => void;

	public abstract onScreenEvent: (e: TypedEvents) => void;
	public abstract onKeyboardEvent: (e: TypedEvents) => void;
	public abstract onMouseEvent: (e: TypedEvents) => void;
}

export default Layer;
