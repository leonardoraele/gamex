import { mount, Transform, Vector2, Image } from '../src/index';

class Character {
	position = new Vector2(0, 0);
	speed = 5;
}

function HeroActor({ input, loader }, { hero }) {
	const horizontalMovement = Number(input.checkActionOngoing('move-right'))
		- Number(input.checkActionOngoing('move-left'));
  	hero.position = hero.position.add(Vector2.right.mul(horizontalMovement * hero.speed));
	const image = loader.getImage('/hero.webp');
	const mirrorX = horizontalMovement < 0;
	hero.position = new Vector2(Math.min(800, Math.max(0, hero.position.x)), hero.position.y);
	return (
		<Transform translate={hero.position}>
			<Image image={image} width={32} height={48} mirrorX={mirrorX} />
		</Transform>
	);
}

class TestScene {
	constructor() {
		this.hero = new Character;
	}
	async setup({ input, loader }) {
		await loader.preload(['/background.webp', '/hero.webp']);
		input.activeInterface = 'keyboard';
		input.scheme = {
			keyboard: {
				'move-left': 'ArrowLeft',
				'move-right': 'ArrowRight',
			},
		};
	}
	// async load() {
	// }
	// updateLoading() {
	// 	return 'Loading...';
	// }
	update({ loader } /*{ input, scene }*/) {
		// if (input.checkActionTrigger('close')) {
		// 	scene.finish();
		// 	return;
		// }
		const image = loader.getImage('/background.webp');
		return (
			<>
				<Image image={image} width={800} height={600} />
				<Transform reset={true} translate={Vector2.down.mul(400)}>
					<HeroActor hero={this.hero} />
				</Transform>
			</>
		);
	}
}

document.addEventListener('DOMContentLoaded', () => mount('body').start(new TestScene));
