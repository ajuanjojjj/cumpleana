
// ===============================
// Sound Management (SoundManager.js - Integrated)
// ===============================
export class SoundManager {
	audioContext: AudioContext;
	oscillators: Record<string, { oscillator: OscillatorNode; gainNode: GainNode; }>;
	soundType: OscillatorType;
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

	playNote(frequency: number) {
		if (this.oscillators[frequency]) return; // Prevent multiple oscillators for same note

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

	stopNote(frequency: string | number) {

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
