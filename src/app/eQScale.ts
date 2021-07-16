import { Note } from './note';

export class Scale {
  notes: Note[] = [];

  addNote(note: Note) {
      this.notes.push(note);
    }

  getNotes() {
    return this.notes;
  }

  clearNotes() {
    this.notes = [];
    return this.notes;
  }
}
