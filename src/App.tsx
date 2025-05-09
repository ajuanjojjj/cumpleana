import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Piano } from './components/Piano';
import { SoundManager } from './lib/SoundManager';
import "./App.css";
import { NoteStore } from './lib/NoteStore';
import { listenTo } from './lib/PasswordListener';






// ===============================
// Main App Component
// ===============================
const InteractivePianoApp = () => {
	const [soundType, setSoundType] = useState<OscillatorType | "custom">('custom');
	const [volume, setVolume] = useState(0.8); // Initial volume
	const [useItalian, setUseItalian] = useState(false);
	const [showingCongrats, setShownCongrats] = useState(false);

	const [soundManager, setSoundManager] = useState<SoundManager | null>(null);	//Casi que es ref, pero me lo inicializan en click
	const noteStore = useRef(new NoteStore());

	useEffect(() => {
		soundManager?.setSoundType(soundType);
	}, [soundManager, soundType]);
	useEffect(() => {
		soundManager?.setMasterVolume(volume);
	}, [soundManager, volume]);
	useEffect(() => {
		return () => {
			soundManager?.destroy();
		};
	}, [soundManager]);


	const toggleNamingConvention = useCallback(() => {
		setUseItalian(prev => !prev);
	}, []);
	const initSound = useCallback(() => {
		const manager = new SoundManager();
		setSoundManager(manager);
		noteStore.current.setSoundManager(manager);
		listenTo(noteStore.current, () => setShownCongrats(true));
	}, []);

	const pianoClass = useItalian ? 'italian' : 'english';

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
			<div className="max-w-4xl w-full space-y-8">
				<h1 className="text-4xl sm:text-6xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text" style={{ fontFamily: 'HyliaSerif, serif' }}>
					Interactive Piano
				</h1>

				<div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-700/50 flex justify-center">
					{soundManager == null && (
						<Button onClick={initSound}>Inicializar</Button>
					)}
					{soundManager != null && (
						<Piano noteStore={noteStore.current} className={pianoClass} />
					)}
				</div>

				<div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
					{/* Sound Type Select */}
					<SoundType soundType={soundType} setSoundType={setSoundType} />

					{/* Volume Control */}
					<VolumeControl volume={volume} setVolume={setVolume} />

					{/* Italian Naming Convention Switch */}
					<NotesLocaleSwitch useItalian={useItalian} toggleNamingConvention={toggleNamingConvention} />
				</div>

				<p className="text-gray-400 text-sm mt-4 text-center">
					Touch the keys or use your mouse to play.  Adjust the sound type and volume using the controls.
				</p>

				<CongratsModal open={showingCongrats} onClose={() => setShownCongrats(false)} />
			</div>
		</div>
	);
};

export default InteractivePianoApp;

function VolumeControl(props: { volume: number, setVolume: (volume: number) => void; }) {
	return <div className="space-y-2 w-full sm:w-64">
		<label htmlFor="volume" className="block text-sm font-medium text-gray-300">
			Volume
		</label>
		<Slider
			id="volume"
			min={0}
			max={1}
			step={0.01}
			value={[props.volume]}
			onValueChange={(newValue) => props.setVolume(newValue[0])}
			className="w-full"
			aria-label="Volume"
			style={{
				//@ts-ignore
				'--slider-track-color': 'linear-gradient(to right, #6b7280, #8b5cf6)',
				'--slider-thumb-color': '#8b5cf6',
			}} />
	</div>;
}

function SoundType(props: { soundType: OscillatorType | "custom"; setSoundType: (type: OscillatorType | "custom") => void; }) {
	const { soundType, setSoundType } = props;

	return (
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
					variant={soundType === 'custom' ? 'default' : 'outline'}
					onClick={() => setSoundType('custom')}
					className="bg-gray-700/50 hover:bg-gray-600/50 text-white border-gray-700/50"
				>
					Custom
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
	);
}

function NotesLocaleSwitch(props: { useItalian: boolean, toggleNamingConvention: () => void; }) {
	return (
		<div className="flex items-center space-x-2">
			<Label htmlFor="italian-naming" className="text-sm font-medium text-gray-300">
				Use Italian Naming
			</Label>
			<Switch
				id="italian-naming"
				checked={props.useItalian}
				onCheckedChange={props.toggleNamingConvention}
				className="bg-gray-700/50 hover:bg-gray-600/50"
			/>
		</div>
	);
}

function CongratsModal(props: { open: boolean; onClose: () => void; }) {
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (props.open) {
			ref.current?.showModal();
		} else {
			ref.current?.close();
		}
	}, [props.open]);


	return (
		<dialog ref={ref} onCancel={props.onClose} className="congrats-modal">
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "HyliaSerif, serif", padding: "1rem", fontSize: "3rem" }}>
				<h2>Tu recompensa se encuentra en la sala de juegos</h2>
			</div>
		</dialog>
	);
}