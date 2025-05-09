export class ImmutableSet<T> {
	private readonly _set: Set<T>;

	constructor(initialValues?: T[]) {
		this._set = new Set(initialValues);
	}

	add(value: T): ImmutableSet<T> {
		const newSet = new ImmutableSet<T>([...this._set]);
		newSet._set.add(value);
		return newSet;
	}

	delete(value: T): ImmutableSet<T> {
		const newSet = new ImmutableSet<T>([...this._set]);
		newSet._set.delete(value);
		return newSet;
	}

	has(value: T): boolean {
		return this._set.has(value);
	}

	values(): T[] {
		return [...this._set.values()];
	}

	get size(): number {
		return this._set.size;
	}
}