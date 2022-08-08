class Vector2 {
	static zero = new Vector2(0, 0);
	static right = new Vector2(1, 0);
	static down = new Vector2(0, 1);
	static left = new Vector2(-1, 0);
	static up = new Vector2(0, 1);

	#x = 0;
	#y = 0;

	get x() {
		return this.#x;
	}

	get y() {
		return this.#y;
	}

	constructor(x, y) {
		this.#x = x;
		this.#y = y;
	}

	add(other) {
		return new Vector2(this.#x + other.x, this.#y + other.y);
	}

	mul(other) {
		return other instanceof Vector2
			? new Vector2(this.#x * other.#x, this.#y * other.#y)
			: new Vector2(this.#x * other, this.#y * other);
	}
}

export { Vector2, Vector2 as default };
