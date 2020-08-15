type Entity = number;

interface Storage {
	[key: string]: {
		data: Map<number, Component<unknown>>;
	}
}

interface Component<T> {
	value: T;
}


class Registry {
	constructor(componentConstructors: (new (...args: unknown[]) => unknown)[]) {
		this.storages = {};
		for (const component of componentConstructors)
			this.storages[component.name] = {
				data: new Map()
			};
		this.entityIdIncrement = 0;
		this.entityComponentCounter = [];
	}

	// entity ////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public create = (): Entity => {
		this.entityComponentCounter[this.entityIdIncrement] = [];
		return this.entityIdIncrement++;
	}

	public destroy = (entity: Entity): void => {
		for (const constructorsName in this.entityComponentCounter[entity]) {
			this.storages[constructorsName].data.delete(entity);
		}

		this.entityComponentCounter[entity] = [];
	}

	public getComponentCount = (entity: Entity): number => this.entityComponentCounter[entity].length;

	// component /////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public insert = <T>(entity: Entity, componentConstructor: new (...args: unknown[]) => T, ...args: unknown[]): Component<T> => {
		const component = { value: new componentConstructor(...args) };
		this.storages[componentConstructor.name].data.set(entity, component);
		this.entityComponentCounter[entity].push(componentConstructor.name);
		return component;
	}

	public getComponents = <T>(entity: Entity, componentConstructor: (new (...args: unknown[]) => T)[]): (Component<T> | undefined)[] => {
		if (this.entityComponentCounter[entity].length === 0)
			throw new Error('entity does not have any component to retrieve');

		const componentsList = [];
		for (const constructor of componentConstructor) {
			componentsList.push(this.storages[constructor.name].data.get(entity) as Component<T>);
		}
		return componentsList;
	}

	public getIntersection = (componentConstructors: (new (...args: unknown[]) => unknown)[]): Set<Entity> => {
		const sortedConstructorNames = componentConstructors
			.map(constructors => constructors.name)
			.sort((first, next) => this.storages[first].data.size - this.storages[next].data.size);

		const smallerComponentListName = sortedConstructorNames.shift() as string;
		if (sortedConstructorNames.length === 0)
			return new Set(this.storages[smallerComponentListName].data.keys());

		const intersection = new Set<Entity>();

		let components = 0;
		for (const entity of this.storages[smallerComponentListName].data.keys()) {
			components = 0;
			for (const name of sortedConstructorNames) {
				if (this.entityComponentCounter[entity].indexOf(name) === -1) {
					break;
				}
				components++;
			}
			if (components === sortedConstructorNames.length)
				intersection.add(entity);
		}

		return intersection;
	}

	public remove = (entity: Entity, componentConstructor: new (...args: unknown[]) => unknown): void => {
		if (this.entityComponentCounter[entity].length === 0)
			throw new Error('entity does not have any component to remove');

		this.storages[componentConstructor.name].data.delete(entity);

		const index = this.entityComponentCounter[entity].indexOf(componentConstructor.name);
		if (index !== -1)
			this.entityComponentCounter[entity].splice(index, 1);
	}

	public clear = (componentConstructor: new (...args: unknown[]) => unknown): void => {
		this.storages[componentConstructor.name].data.clear();
	}

	// registry //////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	public clearAll = (): void => {
		for (const constructorsName in this.storages)
			this.storages[constructorsName].data.clear();
	}



	private readonly storages: Storage;
	private readonly entityComponentCounter: string[][];

	private entityIdIncrement: number;
}


export default Registry;
