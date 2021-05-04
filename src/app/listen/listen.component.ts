import { Component, OnInit } from '@angular/core';
import { INSTRUMENTS } from '../instruments';
import { Instrument } from '../instrument';
import { InstrumentsComponent } from '../instruments/instruments.component';
import { Note } from '../note';
import { Chord } from '../chord';


@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})
export class ListenComponent implements OnInit {
  popularInstruments = INSTRUMENTS;
  currentInstrument = this.popularInstruments[0];   // Default to guitar 

  currentNote = Object.assign(new Note(), {
    notation: "A4",
    frequency: 440.00,
    wavelength: 78.41
  });

  notation: string = '';
  frequency: number = 0;
  wavelength: number = 0;

  constructor() {
    this.calculateNote(-9);
  }

  ngOnInit(): void {

  }

  // Input: sound frequency
  // Output: note name
  calculateNote(halfSteps: number): string {


    var mysteryNote = '';

    // If you are at a higher note, n is positive. 
    // If you are on a lower note, n is negative.
    var nHalfSteps = halfSteps; // the number of half steps away from the fixed note you are.
    // TODO Determine half steps using database of Note, Frequency, Wavelengths

    var freqZero = 440; // A above middle C (A4)
    var a = Math.pow(2, (1 / 12)); // 1.059463094359...

    // Solving for the frequency of the note n half steps away.
    var nFreq = freqZero * Math.pow(a, nHalfSteps);

    const cSpeedOfSound = 345;

    var nWaveLength = cSpeedOfSound / nFreq;



    console.log("input: " + halfSteps);
    console.log("a: " + a.toPrecision(16));
    console.log("nFreq: " + nFreq.toPrecision(6));
    console.log("nWaveLength: " + nWaveLength.toPrecision(6));


    return mysteryNote;
  }


}
