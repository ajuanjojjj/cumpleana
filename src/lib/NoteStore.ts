import { ImmutableSet } from "./ImmutableSet";
import type { SoundManager } from "./SoundManager";


export class NoteStore {
	listeners = new Set<(caller: string) => void>();
	currentSet = new ImmutableSet<string>();

	subscribe = (callback: (caller: string) => void) => {
		this.listeners.add(callback);
		return () => { this.listeners.delete(callback); };
	};
	getActiveNotes = (): ImmutableSet<string> => {
		return this.currentSet;
	};

	note(caller: string, note: NoteIds, octave: number, playing: boolean) {
		const fullNote = `${note}${octave}`;
		if (playing) {
			if (!this.currentSet.has(fullNote)) {
				this.currentSet = this.currentSet.add(fullNote);
				this.notifyListeners(caller);
			}
		} else {
			if (this.currentSet.has(fullNote)) {
				this.currentSet = this.currentSet.delete(fullNote);
				this.notifyListeners(caller);
			}
		}
	};

	setSoundManager(soundManager: SoundManager) {
		return this.subscribe(() => {
			const frequencies = this.currentSet.values().map(getFrequency);
			soundManager.setPlaying(frequencies);
		});
	};

	private notifyListeners(caller: string) {
		this.listeners.forEach((cb) => cb(caller));
	}
};

export type NoteIds = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B' | 'C#' | 'D#' | 'F#' | 'G#' | 'A#';

function getFrequency(noteOctave: string): number {
	const [note, octave] = /^([A-G]#?)(\d+)$/.exec(noteOctave)?.slice(1).values() ?? [null, null];
	if (note == null || octave == null) {
		throw new Error(`Invalid note: ${noteOctave}`);
	}

	const A4 = 440;
	const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	const noteIndex = NOTES.indexOf(note);
	const keyNumber = noteIndex + parseInt(octave) * 12;
	return A4 * Math.pow(2, (keyNumber - 57) / 12);
}