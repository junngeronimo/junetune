import { Note } from './note';

export interface Chord extends Note {
    id: string;
    chord: Note[]; // a Chord consists of 2 or more notes

}