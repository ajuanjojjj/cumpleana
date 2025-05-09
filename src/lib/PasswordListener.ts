import type { NoteIds, NoteStore } from "./NoteStore";


const PASSWORD = "B3 D4 E4  B3 D4 E4  B3 D4 E4 A4 G4".replaceAll("  ", " ").split(" ");
const CONGRATS = "B3 D4 E4  B3 D4 E4  B3 D4 E4 A4 G4  E4 F4 E4 C4 A3".replaceAll("  ", " ").split(" ");	// Sarias Song //G3 A3 C4 A3

const CONGRATS_DURATIONS = [
	0.5, 0.5, 1,
	0.5, 0.5, 1,
	0.5, 0.5, 0.5, 0.5, 1,
	0.5, 0.5, 0.5, 0.5, 2,
	// 0.5, 0.5, 0.5, 2,
];


export function listenTo(store: NoteStore) {
	let playedNotes: string[] = [];
	let prevPlayingNotes: string[] = [];

	return store.subscribe((caller) => {
		if (caller == "congrats") return;	//Don't trigger on congrats notes

		const notes = store.getActiveNotes().values();
		const newNotes = [...notes].filter(note => !prevPlayingNotes.includes(note));	//It should hopefully only be one?

		playedNotes.push(...newNotes);
		if (playedNotes.length > PASSWORD.length) {
			playedNotes.shift();
		}

		console.log("Played notes: ", playedNotes.join(" "));

		if (playedNotes.join("") === PASSWORD.join("")) {
			playCongrats(store);
			playedNotes = [];
		}

		prevPlayingNotes = notes;
	});
}
async function playCongrats(store: NoteStore) {
	await sleep(600);
	for (let i = 0; i < CONGRATS.length; i++) {
		const note = CONGRATS[i].split("") as [NoteIds, string];
		const duration = CONGRATS_DURATIONS[i] * 1000;
		store.note("congrats", note[0], parseInt(note[1]), true);
		await sleep(duration * (60 / 145));
		store.note("congrats", note[0], parseInt(note[1]), false);
	}
}

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}