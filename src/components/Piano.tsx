import { Octave } from "./Octave";
import type { NoteStore } from "@/lib/NoteStore";


interface PianoProps {
	className: string;
	noteStore: NoteStore;
}
export function Piano({ className, noteStore }: PianoProps) {
	return (
		<div className={`piano ${className}`}>
			<Octave octave={3} noteStore={noteStore} />
			<Octave octave={4} noteStore={noteStore} />
			<Octave octave={5} noteStore={noteStore} />
		</div>
	);
};