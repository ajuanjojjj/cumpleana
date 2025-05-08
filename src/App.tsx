import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// ===============================
// Sound Management (SoundManager.js - Integrated)
// ===============================
class SoundManager {
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


// ===============================
// Piano Key Component (Key.js - Integrated)
// ===============================
const Key = ({ note, frequency, isSharp, octavePosition, soundManager }: { note: string, frequency: number, isSharp: boolean, octavePosition: number; soundManager: SoundManager; }) => {
	const [isPressed, setIsPressed] = useState(false);
	const keyRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = () => {
		setIsPressed(true);
		soundManager.playNote(frequency);
		if (keyRef.current) {
			keyRef.current.classList.add('pressed'); // Add 'pressed' class
		}
	};

	const handleMouseUp = () => {
		setIsPressed(false);
		soundManager.stopNote(frequency);
		if (keyRef.current) {
			keyRef.current.classList.remove('pressed');
		}
	};

	const handleMouseLeave = () => {
		setIsPressed(false);
		soundManager.stopNote(frequency);
		if (keyRef.current) {
			keyRef.current.classList.remove('pressed');
		}
	};

	const handleTouchStart = (e: { preventDefault: () => void; }) => {
		e.preventDefault(); // Prevent scrolling on touch
		setIsPressed(true);
		soundManager.playNote(frequency);
		if (keyRef.current) {
			keyRef.current.classList.add('pressed'); // Add 'pressed' class
		}
	};

	const handleTouchEnd = () => {
		setIsPressed(false);
		soundManager.stopNote(frequency);
		if (keyRef.current) {
			keyRef.current.classList.remove('pressed');
		}
	};

	const keyClass = cn(
		'key',
		isSharp ? 'sharp' : 'natural',
		isPressed ? 'pressed' : ''
	);

	const style = {
		...(isPressed && {
			scale: 0.95, // Add scale transform when pressed
			boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Reduce shadow
		}),
		transition: isPressed ? 'transform 0.05s ease, box-shadow 0.05s ease' : 'none', // Smooth transition,
		left: "0px",
	};

	if (isSharp) {
		const leftOffset = octavePosition * 40 - 13;
		style.left = `${leftOffset}px`;
	}

	return (
		<motion.div
			ref={keyRef}
			className={keyClass}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			style={style}
		>
			{/* Display note name */}
			<div className="note-name">{note}</div>
		</motion.div>
	);
};

// ===============================
// Piano Component (Piano.js - Integrated)
// ===============================
const generateNotes = (octaves = 3, startOctave = 3) => {
	const baseNotes = [
		{ note: 'C', italian: 'Do', frequency: 261.63, isSharp: false, octavePosition: 0 },
		{ note: 'C#', italian: 'Do#', frequency: 277.18, isSharp: true, octavePosition: 1 },
		{ note: 'D', italian: 'Re', frequency: 293.66, isSharp: false, octavePosition: 2 },
		{ note: 'D#', italian: 'Re#', frequency: 311.13, isSharp: true, octavePosition: 3 },
		{ note: 'E', italian: 'Mi', frequency: 329.63, isSharp: false, octavePosition: 4 },
		{ note: 'F', italian: 'Fa', frequency: 349.23, isSharp: false, octavePosition: 5 },
		{ note: 'F#', italian: 'Fa#', frequency: 369.99, isSharp: true, octavePosition: 6 },
		{ note: 'G', italian: 'Sol', frequency: 392.00, isSharp: false, octavePosition: 7 },
		{ note: 'G#', italian: 'Sol#', frequency: 415.30, isSharp: true, octavePosition: 8 },
		{ note: 'A', italian: 'La', frequency: 440.00, isSharp: false, octavePosition: 9 },
		{ note: 'A#', italian: 'La#', frequency: 466.16, isSharp: true, octavePosition: 10 },
		{ note: 'B', italian: 'Si', frequency: 493.88, isSharp: false, octavePosition: 11 },
	];

	let allNotes: any[] = [];
	for (let i = 0; i < octaves; i++) {
		const octaveNotes = baseNotes.map(note => ({
			...note,
			note: note.note + (startOctave + i),
			italian: note.italian,
			frequency: note.frequency * Math.pow(2, i),
			octavePosition: note.octavePosition + i * 7, // Correct black key positioning
		}));
		allNotes = allNotes.concat(octaveNotes);
	}
	return allNotes;
};

interface INote {
	note: string;
	italian: string;
	frequency: number;
	isSharp: boolean;
	octavePosition: number;
}
const Piano = ({ useItalian, notes, soundManager }: { useItalian: boolean, notes: INote[]; soundManager: SoundManager; }) => {
	return (
		<div className="piano">
			{notes.map((noteData: INote) => (
				<Key
					soundManager={soundManager}
					key={noteData.note}
					note={useItalian ? noteData.italian : noteData.note}
					frequency={noteData.frequency}
					isSharp={noteData.isSharp}
					octavePosition={noteData.octavePosition}
				/>
			))}
		</div>
	);
};

// ===============================
// Main App Component
// ===============================
const InteractivePianoApp = () => {
	const [soundType, setSoundType] = useState<OscillatorType>('sine');
	const [volume, setVolume] = useState(0.8); // Initial volume
	const [useItalian, setUseItalian] = useState(false);
	const pianoRef = useRef(null);
	const [soundManager, setSoundManager] = useState<SoundManager | null>(null);
	const allNotes = generateNotes(3, 3);


	useEffect(() => {
		soundManager?.setSoundType(soundType);
	}, [soundType]);

	useEffect(() => {
		soundManager?.setMasterVolume(volume);
	}, [volume]);

	useEffect(() => {
		return () => {
			soundManager?.destroy();
		};
	}, []);

	const toggleNamingConvention = useCallback(() => {
		setUseItalian(prev => !prev);
	}, []);
	const initSound = useCallback(() => {
		setSoundManager(new SoundManager());
	}, []);


	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
			<div className="max-w-4xl w-full space-y-8">
				<h1 className="text-4xl sm:text-6xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
					Interactive Piano
				</h1>

				<div
					className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-700/50"
					ref={pianoRef}
				>
					{soundManager != null && <Piano useItalian={useItalian} notes={allNotes} soundManager={soundManager} />}
					{soundManager == null && <Button onClick={initSound}>Inicializar</Button>}
				</div>

				<div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
					{/* Sound Type Select */}
					<div className="space-y-2">
						<label htmlFor="sound-type" className="block text-sm font-medium text-gray-300">
							Sound Type
						</label>
						<div className="flex gap-2">
							<Button
								variant={soundType === 'sine' ? 'default' : 'outline'}
								onClick={() => setSoundType('sine')}
								className="bg-gray-700/50 hover:bg-gray-600/50 text-white border-gray-700/50"
							>
								Sine
							</Button>
							<Button
								variant={soundType === 'square' ? 'default' : 'outline'}
								onClick={() => setSoundType('square')}
								className="bg-gray-700/50 hover:bg-gray-600/50 text-white border-gray-700/50"
							>
								Square
							</Button>
							<Button
								variant={soundType === 'sawtooth' ? 'default' : 'outline'}
								onClick={() => setSoundType('sawtooth')}
								className="bg-gray-700/50 hover:bg-gray-600/50 text-white border-gray-700/50"
							>
								Sawtooth
							</Button>
							<Button
								variant={soundType === 'triangle' ? 'default' : 'outline'}
								onClick={() => setSoundType('triangle')}
								className="bg-gray-700/50 hover:bg-gray-600/50 text-white border-gray-700/50"
							>
								Triangle
							</Button>
						</div>
					</div>

					{/* Volume Control */}
					<div className="space-y-2 w-full sm:w-64">
						<label htmlFor="volume" className="block text-sm font-medium text-gray-300">
							Volume
						</label>
						<Slider
							id="volume"
							min={0}
							max={1}
							step={0.01}
							value={[volume]}
							onValueChange={(newValue) => setVolume(newValue[0])}
							className="w-full"
							aria-label="Volume"
							style={{
								//@ts-ignore
								'--slider-track-color': 'linear-gradient(to right, #6b7280, #8b5cf6)',
								'--slider-thumb-color': '#8b5cf6',
							}}
						/>
					</div>
					<div className="flex items-center space-x-2">
						<Switch
							checked={useItalian}
							onCheckedChange={toggleNamingConvention}
							className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-700/50"
							id="airplane-mode"
						/>
						<Label htmlFor="airplane-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300">
							Italian Notes
						</Label>
					</div>
				</div>
				<p className="text-gray-400 text-sm mt-4 text-center">
					Touch the keys or use your mouse to play.  Adjust the sound type and volume using the controls.
				</p>
			</div>
		</div>
	);
};

export default InteractivePianoApp;

