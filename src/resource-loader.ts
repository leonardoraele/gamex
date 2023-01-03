class ResourceLoader {
	#images: Record<string, HTMLImageElement> = {};

	reset() {
		this.#images = {};
	}

	getImage(src: string): HTMLImageElement|undefined {
		return this.#images[src];
	}

	async loadImage(key: string, src: string): Promise<HTMLImageElement> {
		// TODO
		// if (this.#images[key]?.src === src) {
		// 	return this.#images[key]!.image;
		// }
		const image = new Image();
		await new Promise((resolve, reject) => {
			image.src = src;
			image.onload = resolve;
			image.onerror = reject;
		});
		return this.#images[key] = image;
	}

	async loadImages<T extends Record<string, string>>(images: T): Promise<{ [Key in keyof T]: HTMLImageElement }> {
		await Promise.all(Object.entries(images).map(([key, src]) => this.loadImage(key, src)));
		return Object.fromEntries(
			Object.keys(images)
				.map(key => [key, this.getImage(key)!])
		) as any;
	}
}

export { ResourceLoader, ResourceLoader as default };
