let interval = null;

class TimerView extends HTMLElement {
	constructor() {
		super();
	}

	timer = null;
	connectedCallback() {
		this.timer = document.createElement('div');
		const seconds = this.getAttribute('seconds');
		const toTimer = this.getAttribute('to-timer');

		this.startBtn = document.getElementById('start');
		this.stopBtn = document.getElementById('stop');
		this.resetBtn = document.getElementById('reset');

		this.startBtn.addEventListener('click', this.startTimer.bind(this));
		this.stopBtn.addEventListener('click', this.stopTimer.bind(this));
		this.resetBtn.addEventListener('click', this.resetTimer.bind(this));

		if (seconds) {
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = seconds % 60;
			this.innerHTML = `${minutes} : ${remainingSeconds}`;
		} else if (toTimer) {
			this.innerHTML = toTimer;
		}
	}

	disconnectedCallback() {
		this.startBtn.removeEventListener('click', this.startTimer);
		this.stopBtn.removeEventListener('click', this.stopTimer);
		this.resetBtn.removeEventListener('click', this.resetTimer);
	}

	static get observedAttributes() {
		return ['seconds', 'to-timer'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'to-timer') {
			const [hours, minutes, seconds] = newValue.split(':');
			const currentTime = new Date();
			const targetTime = new Date(
				currentTime.getFullYear(),
				currentTime.getMonth(),
				currentTime.getDate(),
				hours,
				minutes,
				seconds
			);
			const timeDifference = targetTime.getTime() - currentTime.getTime();

			if (timeDifference > 0) {
				const totalSeconds = Math.floor(timeDifference / 1000);
				this.setAttribute('seconds', totalSeconds.toString());
				this.startTimer();
			}
		}
	}

	startTimer() {
		const endTime = Date.parse(new Date()) + Number(this.getAttribute('seconds')) * 1000;
		console.log(endTime);
		interval = setInterval(() => {
			const { total, minutes, seconds } = this.updateTime(endTime);
			this.innerHTML = this.convertTime(minutes, seconds);

			if (total <= 0) {
				clearInterval(interval);
				interval = null;
			}
		}, 1000);
	}

	stopTimer() {
		clearInterval(interval);
		interval = null;
	}

	resetTimer() {
		this.stopTimer();

		const seconds = this.getAttribute('seconds');
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		this.innerHTML = `${minutes} : ${remainingSeconds}`;
	}

	convertTime(min, sec) {
		min = min.toString().padStart(2, '0');
		sec = sec.toString().padStart(2, '0');
		console.log(`${min} : ${sec}`);
		return `${min} : ${sec}`;
	}

	updateTime(endTime) {
		const now = new Date().getTime();
		const difference = endTime - now;
		const total = Number.parseInt(difference / 1000, 10);
		const minutes = Math.floor(total / 60);
		const seconds = Number.parseInt(total % 60, 10);

		return {
			total,
			minutes,
			seconds,
		};
	}
}

customElements.define('timer-view', TimerView);
