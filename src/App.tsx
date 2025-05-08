import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateNotes } from './lib/FreqNotes';
import { Piano } from './components/Piano';
import { SoundManager } from './lib/SoundManager';
import "./App.css";






// ===============================
// Main App Component
// ===============================
const InteractivePianoApp = () => {
	const [soundType, setSoundType] = useState<OscillatorType>('sine');
	const [volume, setVolume] = useState(0.8); // Initial volume
	const [useItalian, setUseItalian] = useState(false);
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

				{soundManager == null && <Button onClick={initSound}>Inicializar</Button>}
				{soundManager != null && (
					<div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-700/50">
						<Piano useItalian={useItalian} notes={allNotes} soundManager={soundManager} />
					</div>
				)
				}
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

