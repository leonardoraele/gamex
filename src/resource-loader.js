class ResourceLoader {
	loadedResources = {};

	reset() {
		this.loadedResources = [];
	}

	getImage(src) {
		return this.loadedResources[src];
	}

	async loadImage(src) {
		if (src in this.loadedResources) {
			return this.loadedResources[src];
		}
		const image = new Image();
		image.src = src;
		await new Promise((resolve, reject) => {
			image.onload = resolve;
			image.onerror = reject;
		});
		return this.loadedResources[src] = image;
	}

	async preload(resources) {
		await Promise.all(resources.map(resource => this.loadImage(resource)));
	}
}

export { ResourceLoader, ResourceLoader as default };
