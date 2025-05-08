// ===============================
// Piano Component (Piano.js - Integrated)
// ===============================
export function generateNotes(octaves = 3, startOctave = 3) {
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

