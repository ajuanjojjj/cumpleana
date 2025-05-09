// ===============================
// Piano Component (Piano.js - Integrated)
// ===============================
export function generateNotes(octaves: number, startOctave: number): INote[] {
	const baseNotes = [
		{ note: 'C', italian: 'Do', frequency: 261.63, isSharp: false },
		{ note: 'C#', italian: 'Do#', frequency: 277.18, isSharp: true },
		{ note: 'D', italian: 'Re', frequency: 293.66, isSharp: false },
		{ note: 'D#', italian: 'Re#', frequency: 311.13, isSharp: true },
		{ note: 'E', italian: 'Mi', frequency: 329.63, isSharp: false },
		{ note: 'F', italian: 'Fa', frequency: 349.23, isSharp: false },
		{ note: 'F#', italian: 'Fa#', frequency: 369.99, isSharp: true },
		{ note: 'G', italian: 'Sol', frequency: 392.00, isSharp: false },
		{ note: 'G#', italian: 'Sol#', frequency: 415.30, isSharp: true },
		{ note: 'A', italian: 'La', frequency: 440.00, isSharp: false },
		{ note: 'A#', italian: 'La#', frequency: 466.16, isSharp: true },
		{ note: 'B', italian: 'Si', frequency: 493.88, isSharp: false },
	];

	let allNotes: any[] = [];
	for (let i = 0; i < octaves; i++) {
		const octaveNotes = baseNotes.map(note => ({
			...note,
			note: note.note + (startOctave + i),
			octave: startOctave + i,
			frequency: note.frequency * Math.pow(2, i),
		}));
		allNotes = allNotes.concat(octaveNotes);
	}
	return allNotes;
};

export interface INote {
	note: string;
	italian: string;
	frequency: number;
	octave: number;
	isSharp: boolean;
}


export const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const BLACK_NOTES = ['C#', 'D#', null, 'F#', 'G#', 'A#', null];