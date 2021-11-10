import { Note } from './note';
export enum StandardNotes {
  A = 0,
  "A#/Bb" = 1,
  B = 2,
  C = 3,
  "C#/Db" = 4,
  D = 5,
  "D#/Eb" = 6,
  E = 7,
  F = 8,
  "F#/Gb" = 9,
  G = 10,
  "G#/Ab" = 11,
}

export class Scale {
  notes:any;
  reverseNotes:any

  constructor() {
    this.notes = new Object();
    this.reverseNotes = new Object();
  }

  addNote(note: Note) {
    let freq:string = (note.getFrequency()).toString();
    let notation:string = note.getNote();

    this.notes[freq] = notation;
  }

  getAllFrequencies() {
    return Object.keys(this.notes);
  }

  getAllNoteNames() {
    if (Object.keys(this.reverseNotes).length === 0) { 
      this.getNoteFreqPairs();
    }
    return Object.keys(this.reverseNotes);
  }

  // Will turn reversedNotes into a Note: Frequency, key/val pair array
  getNoteFreqPairs() {   
    
    let allNotes:any = Object.values(this.notes);
    let allFreqs:any = this.getAllFrequencies();

    for (let i = 0; i < allNotes.length; i++) {
      let currNote = allNotes[i].Note;
      this.reverseNotes[currNote] = allFreqs[i];
    }

    return this.reverseNotes;

  }

  getScale() {
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
    // this.reverseNoteObjects();
    return this.reverseNotes[note];
  }

  // reverse key/value pairs
  private reverseNoteObjects():any[] {
    return Object.entries(this.notes).reduce((ret:any, entry) => {
      const [key, value]:any = entry;
      ret[value] = key;
      return ret;
    }, {});

  }



  
}

// this.notes looks like {
  // {"frequency": 440 Hz
    //   { Note: A4 , 
    //     Wavelength (cm): xx 
      // }: 
  // }}

export class EQScale extends Scale {

  constructor() {
    super();
    // init with the Equal Temperament Scale
    this.notes =  {
      "49": {
        "Note": "G1",
        "Wavelength (cm)": 704.09
      },
      "55": {
        "Note": "A1",
        "Wavelength (cm)": 627.27
      },
      "98": {
        "Note": "G2",
        "Wavelength (cm)": 352.04
      },
      "110": {
        "Note": "A2",
        "Wavelength (cm)": 313.64
      },
      "185": {
        "Note": "F#3/Gb3",
        "Wavelength (cm)": 186.49
      },
      "196": {
        "Note": "G3",
        "Wavelength (cm)": 176.02
      },
      "220": {
        "Note": "A3",
        "Wavelength (cm)": 156.82
      },
      "392": {
        "Note": "G4",
        "Wavelength (cm)": 88.01
      },
      "440": {
        "Note": "A4",
        "Wavelength (cm)": 78.41
      },
      "880": {
        "Note": "A5",
        "Wavelength (cm)": 39.2
      },
      "1760": {
        "Note": "A6",
        "Wavelength (cm)": 19.6
      },
      "2093": {
        "Note": "C7",
        "Wavelength (cm)": 16.48
      },
      "3520": {
        "Note": "A7",
        "Wavelength (cm)": 9.8
      },
      "7040": {
        "Note": "A8",
        "Wavelength (cm)": 4.9
      },
      "16.35": {
        "Note": "C0",
        "Wavelength (cm)": 2109.89
      },
      "17.32": {
        "Note": "C#0/Db0",
        "Wavelength (cm)": 1991.47
      },
      "18.35": {
        "Note": "D0",
        "Wavelength (cm)": 1879.69
      },
      "19.45": {
        "Note": "D#0/Eb0",
        "Wavelength (cm)": 1774.2
      },
      "20.6": {
        "Note": "E0",
        "Wavelength (cm)": 1674.62
      },
      "21.83": {
        "Note": "F0",
        "Wavelength (cm)": 1580.63
      },
      "23.12": {
        "Note": "F#0/Gb0",
        "Wavelength (cm)": 1491.91
      },
      "24.5": {
        "Note": "G0",
        "Wavelength (cm)": 1408.18
      },
      "25.96": {
        "Note": "G#0/Ab0",
        "Wavelength (cm)": 1329.14
      },
      "27.5": {
        "Note": "A0",
        "Wavelength (cm)": 1254.55
      },
      "29.14": {
        "Note": "A#0/Bb0",
        "Wavelength (cm)": 1184.13
      },
      "30.87": {
        "Note": "B0",
        "Wavelength (cm)": 1117.67
      },
      "32.7": {
        "Note": "C1",
        "Wavelength (cm)": 1054.94
      },
      "34.65": {
        "Note": "C#1/Db1",
        "Wavelength (cm)": 995.73
      },
      "36.71": {
        "Note": "D1",
        "Wavelength (cm)": 939.85
      },
      "38.89": {
        "Note": "D#1/Eb1",
        "Wavelength (cm)": 887.1
      },
      "41.2": {
        "Note": "E1",
        "Wavelength (cm)": 837.31
      },
      "43.65": {
        "Note": "F1",
        "Wavelength (cm)": 790.31
      },
      "46.25": {
        "Note": "F#1/Gb1",
        "Wavelength (cm)": 745.96
      },
      "51.91": {
        "Note": "G#1/Ab1",
        "Wavelength (cm)": 664.57
      },
      "58.27": {
        "Note": "A#1/Bb1",
        "Wavelength (cm)": 592.07
      },
      "61.74": {
        "Note": "B1",
        "Wavelength (cm)": 558.84
      },
      "65.41": {
        "Note": "C2",
        "Wavelength (cm)": 527.47
      },
      "69.3": {
        "Note": "C#2/Db2",
        "Wavelength (cm)": 497.87
      },
      "73.42": {
        "Note": "D2",
        "Wavelength (cm)": 469.92
      },
      "77.78": {
        "Note": "D#2/Eb2",
        "Wavelength (cm)": 443.55
      },
      "82.41": {
        "Note": "E2",
        "Wavelength (cm)": 418.65
      },
      "87.31": {
        "Note": "F2",
        "Wavelength (cm)": 395.16
      },
      "92.5": {
        "Note": "F#2/Gb2",
        "Wavelength (cm)": 372.98
      },
      "103.83": {
        "Note": "G#2/Ab2",
        "Wavelength (cm)": 332.29
      },
      "116.54": {
        "Note": "A#2/Bb2",
        "Wavelength (cm)": 296.03
      },
      "123.47": {
        "Note": "B2",
        "Wavelength (cm)": 279.42
      },
      "130.81": {
        "Note": "C3",
        "Wavelength (cm)": 263.74
      },
      "138.59": {
        "Note": "C#3/Db3",
        "Wavelength (cm)": 248.93
      },
      "146.83": {
        "Note": "D3",
        "Wavelength (cm)": 234.96
      },
      "155.56": {
        "Note": "D#3/Eb3",
        "Wavelength (cm)": 221.77
      },
      "164.81": {
        "Note": "E3",
        "Wavelength (cm)": 209.33
      },
      "174.61": {
        "Note": "F3",
        "Wavelength (cm)": 197.58
      },
      "207.65": {
        "Note": "G#3/Ab3",
        "Wavelength (cm)": 166.14
      },
      "233.08": {
        "Note": "A#3/Bb3",
        "Wavelength (cm)": 148.02
      },
      "246.94": {
        "Note": "B3",
        "Wavelength (cm)": 139.71
      },
      "261.63": {
        "Note": "C4",
        "Wavelength (cm)": 131.87
      },
      "277.18": {
        "Note": "C#4/Db4",
        "Wavelength (cm)": 124.47
      },
      "293.66": {
        "Note": "D4",
        "Wavelength (cm)": 117.48
      },
      "311.13": {
        "Note": "D#4/Eb4",
        "Wavelength (cm)": 110.89
      },
      "329.63": {
        "Note": "E4",
        "Wavelength (cm)": 104.66
      },
      "349.23": {
        "Note": "F4",
        "Wavelength (cm)": 98.79
      },
      "369.99": {
        "Note": "F#4/Gb4",
        "Wavelength (cm)": 93.24
      },
      "415.3": {
        "Note": "G#4/Ab4",
        "Wavelength (cm)": 83.07
      },
      "466.16": {
        "Note": "A#4/Bb4",
        "Wavelength (cm)": 74.01
      },
      "493.88": {
        "Note": "B4",
        "Wavelength (cm)": 69.85
      },
      "523.25": {
        "Note": "C5",
        "Wavelength (cm)": 65.93
      },
      "554.37": {
        "Note": "C#5/Db5",
        "Wavelength (cm)": 62.23
      },
      "587.33": {
        "Note": "D5",
        "Wavelength (cm)": 58.74
      },
      "622.25": {
        "Note": "D#5/Eb5",
        "Wavelength (cm)": 55.44
      },
      "659.26": {
        "Note": "E5",
        "Wavelength (cm)": 52.33
      },
      "698.46": {
        "Note": "F5",
        "Wavelength (cm)": 49.39
      },
      "739.99": {
        "Note": "F#5/Gb5",
        "Wavelength (cm)": 46.62
      },
      "783.99": {
        "Note": "G5",
        "Wavelength (cm)": 44.01
      },
      "830.61": {
        "Note": "G#5/Ab5",
        "Wavelength (cm)": 41.54
      },
      "932.33": {
        "Note": "A#5/Bb5",
        "Wavelength (cm)": 37
      },
      "987.77": {
        "Note": "B5",
        "Wavelength (cm)": 34.93
      },
      "1046.5": {
        "Note": "C6",
        "Wavelength (cm)": 32.97
      },
      "1108.73": {
        "Note": "C#6/Db6",
        "Wavelength (cm)": 31.12
      },
      "1174.66": {
        "Note": "D6",
        "Wavelength (cm)": 29.37
      },
      "1244.51": {
        "Note": "D#6/Eb6",
        "Wavelength (cm)": 27.72
      },
      "1318.51": {
        "Note": "E6",
        "Wavelength (cm)": 26.17
      },
      "1396.91": {
        "Note": "F6",
        "Wavelength (cm)": 24.7
      },
      "1479.98": {
        "Note": "F#6/Gb6",
        "Wavelength (cm)": 23.31
      },
      "1567.98": {
        "Note": "G6",
        "Wavelength (cm)": 22
      },
      "1661.22": {
        "Note": "G#6/Ab6",
        "Wavelength (cm)": 20.77
      },
      "1864.66": {
        "Note": "A#6/Bb6",
        "Wavelength (cm)": 18.5
      },
      "1975.53": {
        "Note": "B6",
        "Wavelength (cm)": 17.46
      },
      "2217.46": {
        "Note": "C#7/Db7",
        "Wavelength (cm)": 15.56
      },
      "2349.32": {
        "Note": "D7",
        "Wavelength (cm)": 14.69
      },
      "2489.02": {
        "Note": "D#7/Eb7",
        "Wavelength (cm)": 13.86
      },
      "2637.02": {
        "Note": "E7",
        "Wavelength (cm)": 13.08
      },
      "2793.83": {
        "Note": "F7",
        "Wavelength (cm)": 12.35
      },
      "2959.96": {
        "Note": "F#7/Gb7",
        "Wavelength (cm)": 11.66
      },
      "3135.96": {
        "Note": "G7",
        "Wavelength (cm)": 11
      },
      "3322.44": {
        "Note": "G#7/Ab7",
        "Wavelength (cm)": 10.38
      },
      "3729.31": {
        "Note": "A#7/Bb7",
        "Wavelength (cm)": 9.25
      },
      "3951.07": {
        "Note": "B7",
        "Wavelength (cm)": 8.73
      },
      "4186.01": {
        "Note": "C8",
        "Wavelength (cm)": 8.24
      },
      "4434.92": {
        "Note": "C#8/Db8",
        "Wavelength (cm)": 7.78
      },
      "4698.64": {
        "Note": "D8",
        "Wavelength (cm)": 7.34
      },
      "4978.03": {
        "Note": "D#8/Eb8",
        "Wavelength (cm)": 6.93
      },
      "5274.04": {
        "Note": "E8",
        "Wavelength (cm)": 6.54
      },
      "5587.65": {
        "Note": "F8",
        "Wavelength (cm)": 6.17
      },
      "5919.91": {
        "Note": "F#8/Gb8",
        "Wavelength (cm)": 5.83
      },
      "6271.93": {
        "Note": "G8",
        "Wavelength (cm)": 5.5
      },
      "6644.88": {
        "Note": "G#8/Ab8",
        "Wavelength (cm)": 5.19
      },
      "7458.62": {
        "Note": "A#8/Bb8",
        "Wavelength (cm)": 4.63
      },
      "7902.13": {
        "Note": "B8",
        "Wavelength (cm)": 4.37
      }
    };
    this.getNoteFreqPairs();
    
  }

}