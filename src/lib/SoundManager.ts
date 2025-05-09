
// ===============================
// Sound Management (SoundManager.js - Integrated)
// ===============================
export class SoundManager {
	audioContext: AudioContext;
	oscillators: Record<string, { oscillator: OscillatorNode; gainNode: GainNode; }>;
	soundType: OscillatorType | "custom";
	masterGainNode: any;
	constructor() {
		this.audioContext = new (window.AudioContext)();
		this.oscillators = {}; // Store oscillators for currently playing notes
		this.soundType = 'sine'; // Default sound type
		this.masterGainNode = this.audioContext.createGain(); // Master gain
		this.masterGainNode.gain.value = 0.8; // Default volume
		this.masterGainNode.connect(this.audioContext.destination);
	}

	setSoundType(type: OscillatorType) {
		this.soundType = type;
	}

	setMasterVolume(value: number) {
		this.masterGainNode.gain.value = value;
	}

	setPlaying(frequencies: number[]) {
		frequencies.forEach((frequency) => {
			this.play(frequency);
		});
		const stopped = Object.keys(this.oscillators).filter((key) => !frequencies.includes(parseFloat(key)));
		stopped.forEach((frequency) => {
			this.stop(parseFloat(frequency));
		});
	}

	play(frequency: number) {
		if (this.oscillators[frequency]) return; // Prevent multiple oscillators for same note

		if (this.soundType === 'custom') return this.myPlay(frequency); // Custom sound generation

		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();

		oscillator.type = this.soundType;
		oscillator.frequency.value = frequency;
		gainNode.gain.value = 0.5; // Note volume
		gainNode.connect(this.masterGainNode); // Connect to master gain

		oscillator.connect(gainNode);
		oscillator.start();
		this.oscillators[frequency] = { oscillator, gainNode }; // Store both
	}

	myPlay(freq: number) {
		const now = this.audioContext.currentTime;
		const duration = 0.5;

		const osc = this.audioContext.createOscillator();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(freq, now);

		const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
		const data = noiseBuffer.getChannelData(0);
		for (let i = 0; i < data.length; i++) {
			data[i] = (Math.random() * 2 - 1) * 0.2;
		}
		const noiseSource = this.audioContext.createBufferSource();
		noiseSource.buffer = noiseBuffer;

		const noiseGain = this.audioContext.createGain();
		noiseGain.gain.setValueAtTime(0.05, now);

		const filter = this.audioContext.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(1000, now);

		const gain = this.audioContext.createGain();
		gain.gain.setValueAtTime(0, now);
		gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
		gain.gain.linearRampToValueAtTime(0, now + duration);

		osc.connect(gain);
		noiseSource.connect(noiseGain).connect(filter).connect(gain);
		gain.connect(this.audioContext.destination);

		osc.start(now);
		osc.stop(now + duration);

		noiseSource.start(now);
		noiseSource.stop(now + duration);
	}

	stop(frequency: number) {
		if (this.oscillators[frequency]) {
			const { oscillator, gainNode } = this.oscillators[frequency];
			gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime); // Quick fade out
			oscillator.stop(this.audioContext.currentTime + 0.05); // Stop a bit later
			delete this.oscillators[frequency];
		}
	}

	destroy() {
		if (this.audioContext) {
			try {
				this.audioContext.close();
			} catch (e) {
				console.error("Error closing audio context", e);
			}
		}
		this.oscillators = {};
	}
}
