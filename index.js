const app = new PIXI.Application({ backgroundColor: 0xffffff, width: 800, height: 300 });
document.body.appendChild(app.view);

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const notes = [
	{ name: 'C', freq: 261.63 },
	{ name: 'D', freq: 293.66 },
	{ name: 'E', freq: 329.63 },
	{ name: 'F', freq: 349.23 },
	{ name: 'G', freq: 392.00 },
	{ name: 'A', freq: 440.00 },
	{ name: 'B', freq: 493.88 }
];

const keyWidth = 100;
const keyHeight = 300;

function playNote(freq) {
	const oscillator = audioCtx.createOscillator();
	const gainNode = audioCtx.createGain();

	oscillator.type = 'sine'; // Puedes probar 'square', 'sawtooth', etc.
	oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

	gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // volumen
	oscillator.connect(gainNode).connect(audioCtx.destination);

	oscillator.start();
	oscillator.stop(audioCtx.currentTime + 0.5); // suena 0.5 segundos
}

notes.forEach((note, index) => {
	const key = new PIXI.Graphics();
	key.beginFill(0xffffff);
	key.lineStyle(2, 0x000000);
	key.drawRect(0, 0, keyWidth, keyHeight);
	key.endFill();
	key.x = index * keyWidth;
	key.interactive = true;
	key.buttonMode = true;

	key.on('pointerdown', () => {
		playNote(note.freq);
		key.tint = 0xcccccc;
	});
	key.on('pointerup', () => key.tint = 0xffffff);
	key.on('pointerupoutside', () => key.tint = 0xffffff);

	app.stage.addChild(key);
});
