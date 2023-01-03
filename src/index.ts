import InputController from './input';
import { type JsxElement } from './jsx';
import ResourceLoader from './resource-loader';

export * from './vector2';
export * from './components/canvas2d';

type Listener = () => unknown;

class Hooks {
	afterChildrenListeners: Listener[] = [];
	afterChildren(); // Notifies listeners
	afterChildren(listener: Listener); // Register a listener
	afterChildren(listener?: Listener) {
		if (listener) {
			this.afterChildrenListeners.push(listener);
		} else {
			this.afterChildrenListeners.forEach(listener => listener());
		}
	}
}

function update(element: JsxElement|JsxElement[], frameController: FrameController) {
	const hooks = new Hooks();

	if (Array.isArray(element)) { // Implicit fragment
		for (const child of element) {
			update(child, frameController);
		}
	} else if (typeof element.type === 'function') { // Function component
		const output = element.type(element.props, frameController, hooks);
		const children = Array.isArray(output) ? output
			: typeof output?.type === 'function' ? [output]
			: [];
		for (const child of children) {
			update(child, frameController);
		}
	}

	hooks.afterChildren();
}

interface Space {
	width: number;
	height: number;
}

interface FrameController {
	input: InputController,
	delta: number;
	timestamp: number;
	context: CanvasRenderingContext2D;
	space: Space;
	loader: ResourceLoader;
}

interface Scene {
	setup(resources: {
		input: InputController,
		context: CanvasRenderingContext2D,
		space: Space,
		loader: ResourceLoader,
	}): Promise<unknown>;
	update(controller: FrameController): JsxElement|JsxElement[]|null;
}

export function mount(mountingPoint: string|Node, { width = 800, height = 600 } = {}) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const context: CanvasRenderingContext2D|null = canvas.getContext('2d');
	if (!context) {
		const p = document.createElement('p');
		const error = new Error();
		error.message = p.textContent = 'Failed to initialize game. Cause: Canvas 2D not supported in this browser.';
		throw error
	}
	const mountingPointElement = mountingPoint instanceof Node ? mountingPoint
		: typeof mountingPoint === 'string' ? document.querySelector(mountingPoint)
			?? (() => { throw new Error('Mounting point not found.') })()
		: (() => { throw new Error('Invalid mounting point.') })();
	mountingPointElement.appendChild(canvas);
	return {
		async start(scene: Scene) {
			let lastFrameTimestamp = globalThis.performance.now();
			const inputController = new InputController;
			const loader = new ResourceLoader;
			inputController.start();
			await scene.setup({ input: inputController, context, space: { width, height }, loader });
			window.requestAnimationFrame(function acceptAnimationFrame(currentTimestamp) {
				const frameController: FrameController = {
					input: inputController,
					delta: currentTimestamp - lastFrameTimestamp,
					timestamp: currentTimestamp,
					context,
					space: { width, height },
					loader,
				};
				lastFrameTimestamp = currentTimestamp;
				const topLevelNode = scene.update(frameController);
				if (topLevelNode) {
					update(topLevelNode, frameController);
				}
				inputController.update(currentTimestamp);
				window.requestAnimationFrame(acceptAnimationFrame);
			});
		},
	};
}
