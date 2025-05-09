import type { NoteStore } from "@/lib/NoteStore";
import { useCallback, useSyncExternalStore } from "react";

import './Piano.css'; // Import CSS for styling

interface OctaveProps {
	noteStore: NoteStore;
	octave: number;
}
export function Octave(props: OctaveProps) {
	const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
	const BLACK_NOTES = ['C#', 'D#', 'F#', 'G#', 'A#'] as const;

	return (
		<div className="octave">
			{/* White Keys */}
			{WHITE_NOTES.map((i) => (
				<WhiteKey
					key={`white-${i}`}
					octave={props.octave}
					note={i}
					noteStore={props.noteStore}
				/>
			))}

			{/* Black Keys */}
			{BLACK_NOTES.map((i) => (
				<BlackKey
					key={`black-${i}`}
					octave={props.octave}
					note={i}
					noteStore={props.noteStore}
				/>
			))}
		</div>
	);
}

interface WhiteKeyProps {
	note: NoteIds;
	octave: number;
	noteStore: NoteStore;
}
function WhiteKey(props: WhiteKeyProps) {
	const playingNotes = useSyncExternalStore(props.noteStore.subscribe, props.noteStore.getActiveNotes);
	const playCallback = useCallback(() => props.noteStore.note("click", props.note, props.octave, true), []);
	const stopCallback = useCallback(() => props.noteStore.note("click", props.note, props.octave, false), []);

	const playing = playingNotes.has(`${props.note}${props.octave}`) ? 'pressed' : '';
	return (
		<div
			onMouseDown={playCallback}
			onMouseUp={stopCallback}
			onMouseLeave={stopCallback}

			onTouchStart={playCallback}
			onTouchEnd={stopCallback}

			className={`key white ${playing}`}
		>
			<div className="italian name">{getItalian(props.note)}</div>
			<div className="english name">{props.note}{props.octave}</div>
			<div className="bound name"></div>
		</div>
	);
}

interface BlackKeyProps {
	note: 'C#' | 'D#' | 'F#' | 'G#' | 'A#';
	octave: number;
	noteStore: NoteStore;
}
function BlackKey(props: BlackKeyProps) {
	const playingNotes = useSyncExternalStore(props.noteStore.subscribe, props.noteStore.getActiveNotes);
	const playCallback = useCallback(() => props.noteStore.note("click", props.note, props.octave, true), [props.note, props.noteStore, props.octave]);
	const stopCallback = useCallback(() => props.noteStore.note("click", props.note, props.octave, false), [props.note, props.noteStore, props.octave]);

	const playing = playingNotes.has(`${props.note}${props.octave}`) ? 'pressed' : '';

	const BLACK_NOTES = ['C#', 'D#', null, 'F#', 'G#', 'A#', null];
	const position = BLACK_NOTES.indexOf(props.note) + 1; // +1 because the first white key is at index 0
	const style = {
		left: `calc(${position} * 100% / 7 - 0.3 * 100% / 7)`,
	} as const;

	return (
		<div
			onMouseDown={playCallback}
			onMouseUp={stopCallback}
			onMouseLeave={stopCallback}

			onTouchStart={playCallback}
			onTouchEnd={stopCallback}

			style={style}
			className={`key black ${playing}`}
		>
			<div className="italian name">{getItalian(props.note)}</div>
			<div className="english name">{props.note}{props.octave}</div>
			<div className="bound name"></div>
		</div>
	);
}

type NoteIds = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B' | 'C#' | 'D#' | 'F#' | 'G#' | 'A#';

function getItalian(note: NoteIds) {
	switch (note) {
		case 'C':
			return 'Do';
		case 'D':
			return 'Re';
		case 'E':
			return 'Mi';
		case 'F':
			return 'Fa';
		case 'G':
			return 'Sol';
		case 'A':
			return 'La';
		case 'B':
			return 'Si';
		case 'C#':
			return 'Do#';
		case 'D#':
			return 'Re#';
		case 'F#':
			return 'Fa#';
		case 'G#':
			return 'Sol#';
		case 'A#':
			return 'La#';
	}
}