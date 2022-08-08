import InputController from './input';
import ResourceLoader from './resource-loader';
export * from './vector2';
export * from './components/canvas2d';

class Hooks {
	afterChildrenListeners = [];
	afterChildren(listener) {
		if (listener) {
			this.afterChildrenListeners.push(listener);
		} else {
			this.afterChildrenListeners.forEach(listener => listener());
		}
	}
}

function update(component, frameController, props) {
	const hooks = new Hooks();

	if (typeof component === 'function') {
		const output = component(frameController, props, hooks);
		const children = Array.isArray(output) ? output
			: typeof output?.type === 'function' ? [output]
			: output?.props.children ?? [];
		for (const child of children) {
			update(child.type, frameController, child.props);
		}
	} else if (props.children) {
		const children = Array.isArray(props.children)
			? props.children
			: [props.children];
		for (const child of children) {
			update(child.type, frameController, child.props);
		}
	}

	hooks.afterChildren();
}

export function mount(mountingPoint, { width = 800, height = 600 } = {}) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');
	const mountingPointElement = mountingPoint instanceof Node
		? mountingPoint
		: document.querySelector(mountingPoint);
	mountingPointElement.appendChild(canvas);
	return {
		async start(scene) {
			let lastFrameTimestamp = globalThis.performance.now();
			const inputController = new InputController;
			const loader = new ResourceLoader;
			inputController.start();
			await scene.setup({ input: inputController, context, space: { width, height }, loader });
			const updateFn = (currentTimestamp) => {
				const frameController = {
					input: inputController,
					delta: currentTimestamp - lastFrameTimestamp,
					timestamp: currentTimestamp,
					context,
					space: { width, height },
					loader,
				};
				lastFrameTimestamp = currentTimestamp;
				const topLevelNode = scene.update(frameController);
				update(topLevelNode.type, frameController, topLevelNode.props);
				inputController.update(currentTimestamp);
				window.requestAnimationFrame(updateFn);
			}
			window.requestAnimationFrame(updateFn);
		},
	};
}
