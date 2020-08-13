type Entity = number;

interface Storage {
	[key: string]: Map<number, Component<unknown>>;
}

interface Component<T> {
	value: T;
}


class Registry {
	constructor(componentConstructors: (new (...args: unknown[]) => unknown)[]) {
		this.storages = {};
		for (const component of componentConstructors)
			this.storages[component.name] = new Map();
		this.entityIdIncrement = 0;
		this.entityComponentCounter = [];
	}

	// entity ////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public create = (): Entity => {
		this.entityComponentCounter[this.entityIdIncrement] = 0;
		return this.entityIdIncrement++;
	}

	public destroy = (entity: Entity): void => {
		let componentCount = this.entityComponentCounter[entity];
		for (const constructorsName in this.storages) {
			if (this.storages[constructorsName].delete(entity)) componentCount--;
			if (componentCount === 0) break;
		}

		this.entityComponentCounter[entity] = componentCount;
	}

	public getComponentCount = (entity: Entity): number => this.entityComponentCounter[entity];

	// component /////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public insert = <T>(entity: Entity, componentConstructor: new (...args: unknown[]) => T, ...args: unknown[]): Component<T> => {
		const component = { value: new componentConstructor(...args) };
		this.storages[componentConstructor.name].set(entity, component);
		this.entityComponentCounter[entity]++;
		return component;
	}

	public get = <T>(entity: Entity, componentConstructor: new (...args: unknown[]) => T): Component<T> | undefined => {
		if (this.entityComponentCounter[entity] === 0)
			throw new Error('entity does not have any component to retrieve');

		return this.storages[componentConstructor.name].get(entity) as Component<T>;
	}

	public remove = (entity: Entity, componentConstructor: new (...args: unknown[]) => unknown): void => {
		if (this.entityComponentCounter[entity] === 0)
			throw new Error('entity does not have any component to remove');

		this.storages[componentConstructor.name].delete(entity);
		this.entityComponentCounter[entity]--;
	}

	public clear = (componentConstructor: new (...args: unknown[]) => unknown): void => {
		this.storages[componentConstructor.name].clear();
	}

	// registry //////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public clearAll = (): void => {
		for (const constructorsName in this.storages)
			this.storages[constructorsName].clear();
	}



	private readonly storages: Storage;
	private readonly entityComponentCounter: number[];

	private entityIdIncrement: number;
}


export default Registry;
