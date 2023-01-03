import InputController from '~/input';
import { type JsxElement } from '~/jsx/jsx-runtime';
import ResourceLoader from '~/resource-loader';

export * from '~/vector2';
export * from '~/components/canvas2d';

function update(element: JsxElement|JsxElement[], frameController: FrameController) {
	if (Array.isArray(element)) { // Implicit fragment
		for (const child of element) {
			update(child, frameController);
		}
	} else if (element) {
		// TODO To avoid saving and restoring rendering context for every component, we should replace the context
		// prop in the frameController for a getter function that saves the content state the first time it is used and
		// exposes a method that conditionally restore it only if it was used (thus, saved).
		frameController.context.save();
		const output = typeof element.type === 'function'
			? element.type(element.props, frameController)
			: element.type.update(element.props, frameController);
		const children = Array.isArray(output) ? output
			: output ? [output]
			: [];
		for (const child of children) {
			update(child, frameController);
		}
		frameController.context.restore();
	}
}

interface Space {
	width: number;
	height: number;
}

export interface FrameController {
	readonly input: InputController,
	readonly delta: number;
	readonly timestamp: number;
	readonly context: CanvasRenderingContext2D;
	readonly space: Space;
	readonly loader: ResourceLoader;
}

export interface Scene {
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
