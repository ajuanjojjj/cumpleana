
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import type { SoundManager } from '@/lib/SoundManager';
import type { INote } from '@/lib/FreqNotes';
import './PianoKey.css'; // Import CSS for styling

interface KeyProps {
	labelType: "american" | "italian";
	note: INote;
	soundManager: SoundManager;
}
export function PianoKey({ note, soundManager, labelType }: KeyProps) {
	const [isPressed, setIsPressed] = useState(false);
	const keyRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = () => {
		setIsPressed(true);
		soundManager.playNote(note.frequency);
		if (keyRef.current) {
			keyRef.current.classList.add('pressed'); // Add 'pressed' class
		}
	};

	const handleMouseUp = () => {
		setIsPressed(false);
		soundManager.stopNote(note.frequency);
		if (keyRef.current) {
			keyRef.current.classList.remove('pressed');
		}
	};

	const handleMouseLeave = () => {
		setIsPressed(false);
		soundManager.stopNote(note.frequency);
		if (keyRef.current) {
			keyRef.current.classList.remove('pressed');
		}
	};

	const handleTouchStart = (e: { preventDefault: () => void; }) => {
		e.preventDefault(); // Prevent scrolling on touch
		setIsPressed(true);
		soundManager.playNote(note.frequency);
		if (keyRef.current) {
			keyRef.current.classList.add('pressed'); // Add 'pressed' class
		}
	};

	const handleTouchEnd = () => {
		setIsPressed(false);
		soundManager.stopNote(note.frequency);
		if (keyRef.current) {
			keyRef.current.classList.remove('pressed');
		}
	};

	const keyClass = cn(
		'key',
		note.isSharp ? 'sharp' : 'natural',
		isPressed ? 'pressed' : ''
	);

	const style = {
		...(isPressed && {
			scale: 0.95, // Add scale transform when pressed
			boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Reduce shadow
		}),
		transition: isPressed ? 'transform 0.05s ease, box-shadow 0.05s ease' : 'none', // Smooth transition,
	};

	let noteName;
	switch (labelType) {
		case 'american': noteName = note.note; break;
		case 'italian': noteName = note.italian; break;
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
			<div className="note-name">{noteName}</div>
		</motion.div>
	);
};