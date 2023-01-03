class Vector2 {
	static readonly zero = new Vector2(0, 0);
	static readonly right = new Vector2(1, 0);
	static readonly down = new Vector2(0, 1);
	static readonly left = new Vector2(-1, 0);
	static readonly up = new Vector2(0, 1);

	readonly #x;
	readonly #y;

	get x() {
		return this.#x;
	}

	get y() {
		return this.#y;
	}

	constructor(x: number, y: number) {
		this.#x = x;
		this.#y = y;
	}

	add(other: Vector2) {
		return new Vector2(this.#x + other.x, this.#y + other.y);
	}

	mul(other: Vector2|number) {
		return other instanceof Vector2
			? new Vector2(this.#x * other.#x, this.#y * other.#y)
			: new Vector2(this.#x * other, this.#y * other);
	}

	/**
	 * Alias for {@link mul}.
	 */
	times(other: Vector2|number) {
		return this.mul(other);
	}
}

export { Vector2, Vector2 as default, Vector2 as V2, Vector2 as V };
