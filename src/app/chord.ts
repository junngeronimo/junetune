import { Note } from './note';

export interface Chord extends Note {
    id: string;
    chord: Note[];
}