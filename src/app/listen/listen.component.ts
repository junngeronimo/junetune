import { Component, OnInit } from '@angular/core';
import { INSTRUMENTS } from '../instruments';
import { Instrument } from '../instrument';
import { InstrumentsComponent } from '../instruments/instruments.component';
import { Note } from '../note';
import { Chord } from '../chord';
import { Scale } from '../eQScale';
import adapter from 'webrtc-adapter';


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

  calcNoteTest = this.calculateNote(-9);


  
  constructor() {
    
  }

  ngOnInit(): void {
    this.captureAudio();
  }

  /**
   * calculateNote()
   * 
   * @param frequency - listen for freq to calc number of half steps away from base note (A4 - 440hz)
   * @returns Note name as a string
   */
  calculateNote(frequency: number): string {
    var mysteryNote:string = '' // return note calc using input frequency;
    var halfSteps:number = 0 // use input frequency to calc steps away from 440hz;

    // If you are at a higher note, n is positive. 
    // If you are on a lower note, n is negative.
    var nHalfSteps:number = halfSteps; // the number of half steps away from the fixed note you are.

    // TODO Determine half steps using database of Note, Frequency, Wavelengths
    //    - see asset for equal-tempered-scale.csv

    var freqZero:number = 440; // A above middle C (A4) base note
    var a = Math.pow(2, (1 / 12)); // 1.059463094359... chromatic scale is base 12. ratio of 1/12 approx from each note

    // Solving for the frequency of the note n half steps away.
    // fn = f0 * (a)^n
    var nFreq = freqZero * Math.pow(a, nHalfSteps);

    const cSpeedOfSound = 345;

    var nWaveLength = cSpeedOfSound / nFreq;

    console.log("input: " + halfSteps);
    console.log("a: " + a.toPrecision(16));
    console.log("nFreq: " + nFreq.toPrecision(6));
    console.log("nWaveLength: " + nWaveLength.toPrecision(6));

    mysteryNote = nFreq.toString();
    
    return mysteryNote;

  } // --calculateNote()

  
  captureAudio(): void {
    
    const myAudio = document.querySelector('audio');
    const pre = document.querySelector('pre');
    // const video = document.querySelector('video');
    const myScript = document.querySelector('script');
    const range = document.querySelector('input');
    const freqResponseOutput = document.querySelector('.freq-response-output');
    // create float32 arrays for getFrequencyReponse
    const myFrequencyArray = new Float32Array(5);
    myFrequencyArray[0] = 1000;
    myFrequencyArray[1] = 2000;
    myFrequencyArray[2] = 3000;
    myFrequencyArray[3] = 4000;
    myFrequencyArray[4] = 5000;
    const magResponseOutput = new Float32Array(5);
    const phaseResponseOutput = new Float32Array(5);
    // getUserMedia block - grab stream
    // put it into a MediaStreamAudioSourceNode
    // also output the visuals into a video element - OPTIONAL
    if (navigator.mediaDevices) {
      console.log('getUserMedian supported.');
      navigator.mediaDevices.getUserMedia ({audio: true, video: false})
      .then(function(stream) {
        myAudio!.srcObject = stream;
        myAudio!.onloadedmetadata = function(e) {
          myAudio?.play();
          myAudio!.muted = true;
        };
      // Create a MediaStreamAUdioSourceNode
      // Feed the HTMLMediaElement into it
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      // Create a biquadfilter
      const biquadFilter = audioCtx.createBiquadFilter();
      biquadFilter.type = "lowshelf";
      biquadFilter.frequency.value = 1000;
      biquadFilter.gain.value = +range!.value;

      source.connect(biquadFilter);
      biquadFilter.connect(audioCtx.destination);
      
      range!.oninput = function() {
        biquadFilter.gain.value = +range!.value;
      }
      
      function calcFrequencyResponse() {
        biquadFilter.getFrequencyResponse(myFrequencyArray,magResponseOutput,phaseResponseOutput);
        for (let i = 0; i <= myFrequencyArray.length-1;i++){
            let listItem = document.createElement('li');
            listItem.innerHTML = '<strong>' + myFrequencyArray[i] + 'Hz</strong>: Magnitude ' + magResponseOutput[i] + ', Phase ' + phaseResponseOutput[i] + ' radians.';
            freqResponseOutput!.appendChild(listItem);
        }
     }
     calcFrequencyResponse();
    })
    .catch(function(err) {
      console.log('The following gUM error occured: ' + err);
    });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }

    pre!.innerHTML = myScript!.innerHTML;
  } // --captureAudio()

} // --ListenComponent()
