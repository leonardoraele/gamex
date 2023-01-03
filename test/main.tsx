import { mount, Transform, Vector2, Picture, FrameController } from '/src/index';
import { EngineXClassComponent } from '/src/jsx/jsx-runtime';

class Character implements EngineXClassComponent<{ horizontalMovement?: number }> {
	private position = new Vector2(0, 0);
	private speed = 5;
	private image: HTMLImageElement;
	private facing: 'right'|'left' = 'right';

	constructor(image: HTMLImageElement) {
		this.image = image;
	}

	update({ horizontalMovement = 0 }) {
		const newX = Math.min(800 - 32, Math.max(0, this.position.x + horizontalMovement * this.speed));
		this.position = new Vector2(newX, this.position.y);
		this.facing = horizontalMovement < 0 ? 'left'
			: horizontalMovement > 0 ? 'right'
			: this.facing;
		return (
			<Transform translate={this.position}>
				<Picture image={this.image} width={32} height={48} mirrorX={this.facing === 'left'} />
			</Transform>
		);
	}
}

class TestScene {
	private hero!: Character;
	private backgroundImage!: HTMLImageElement;

	async setup({ input, loader }: FrameController) {
		const { background: backgroundImage, hero: heroImage } = await loader.loadImages({
			background: '/background.webp',
			hero: '/hero.webp',
		});
		this.backgroundImage = backgroundImage;
		this.hero = new Character(heroImage);
		input.activeInterface = 'keyboard';
		input.scheme.keyboard = {
			'move-left': 'ArrowLeft',
			'move-right': 'ArrowRight',
		};
	}
	// async load() {
	// }
	// updateLoading() {
	// 	return 'Loading...';
	// }
	update({ input, /* scene */ }: FrameController) {
		// if (input.checkActionTrigger('back')) {
		// 	scene.finish();
		// 	return;
		// }
		const heroMovement = Number(input.checkActionOngoing('move-right'))
			- Number(input.checkActionOngoing('move-left'));
		return (
			<>
				<Picture image={this.backgroundImage} width={800} height={600} />
				<Transform reset={true} translate={Vector2.down.mul(400)}>
					<this.hero horizontalMovement={heroMovement}/>
				</Transform>
			</>
		);
	}
}

document.addEventListener('DOMContentLoaded', () => mount('body').start(new TestScene));
