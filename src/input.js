class InputController {
	scheme = {};
	keyState = {};
	lastUpdate = 0;
	activeInterface = 'keyboard';

	start() {
		document.addEventListener('keydown', event => {
			this.keyState[event.code] = this.timestamp;
		});
		document.addEventListener('keyup', event => {
			delete this.keyState[event.code];
		});
	}

	/**
	 * @param {Number} timestamp
	 */
	update(timestamp) {
		this.lastUpdate = timestamp;
	}

	/**
	 * @param {String} action
	 */
	getScalarAction(action) {
		const { negative, positive } = this.scheme[this.activeInterface][action];
		return this.checkKeyDown(positive)
			- this.checkKeyDown(negative);
	}

	/**
	 * @param {String} keyCode
	 */
	checkKeyDown(keyCode) {
		return keyCode in this.keyState;
	}

	/**
	 * @param {String} action
	 */
	checkActionTriggered(action) {
		const keyCode = this.scheme[this.activeInterface][action];
		return this.keyState[keyCode] === this.lastUpdate;
	}

	/**
	 * @param {String} action
	 */
	checkActionOngoing(action) {
		const keyCode = this.scheme[this.activeInterface][action];
		return this.checkKeyDown(keyCode);
	}
}

export { InputController, InputController as default };
