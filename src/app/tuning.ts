export class Tuning {

  notes: Tone[];

  constructor() {
    this.notes = [];
  }

  getNotes(): string[] {

    let result = [];
    for (let i of this.notes) {
      result.push(i.note);
    }

    return result;
  }

  getFirstNote(): Tone {
    
    return this.notes[0];
  }

  findNote(s:string): Tone {
    let t = new Tone();
    for (let tone of this.notes) {
      if (tone.note === s) {
        t = tone;
      }
    }

    return t;
  }

  addNote(t:Tone): void {
    this.notes.push(t);
  }

}

export class Tone {
  note: string;
  offset: number;
  difference: number;

  constructor() {
    this.note = "";
    this.offset = 0;
    this.difference = 0;
  }

  getNote(): string {
    return this.note;
  }

  getOffset(): number {
    return this.offset;
  }

  getDifference(): number {
    return this.difference;
  }

  setNote(n:string): void {
    this.note = n;
  }
  
  setOffset(o:number): void {
    this.offset = o;
  }

  setDifference(d:number): void {
    this.difference = d;
  }

}
