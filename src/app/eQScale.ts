import { Note } from './note';

export class Scale {
  notes:any = new Object();
  reverseNotes:any = new Object();

  addNote(note: Note) {
    let freq:string = (note.getFrequency()).toString();
    let notation:string = note.getNote();

    this.notes[freq] = notation;
  }

  getNotes() {
    return this.notes;
  }

  clearNotes() {
    this.notes = [];
    return this.notes;
  }

  // find a note name using frequency value
  findNoteUsingFrequency(freq: string) {
    return this.notes[freq];
  }

  // update reversed key/value pairs and find note
  findFrequencyUsingNote(note: string) {
    this.reverseNotes = this.reverseNoteObjects();
    return this.reverseNotes[note];
  }

  // reverse key/value pairs
  reverseNoteObjects(): any {
    return Object.keys(this.notes).reduce((ret:any, key) => {
      ret[this.notes[key]] = key;
      return ret;
    }, {});
  }

  constructor() {
    this.reverseNotes = this.reverseNoteObjects();
  }

  
}
