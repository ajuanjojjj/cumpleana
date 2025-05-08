import type { SoundManager } from "@/lib/SoundManager";
import { PianoKey } from "./key/PianoKey";

interface INote {
	note: string;
	italian: string;
	frequency: number;
	isSharp: boolean;
	octavePosition: number;
}
export function Piano({ useItalian, notes, soundManager }: { useItalian: boolean, notes: INote[]; soundManager: SoundManager; }) {

	return (
		<div className="piano">
			{notes.map((noteData: INote) => (
				<PianoKey
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