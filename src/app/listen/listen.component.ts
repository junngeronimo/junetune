import { Component, OnInit } from '@angular/core';
import { INSTRUMENTS } from '../instruments';
import { Instrument } from '../instrument';
import { InstrumentsComponent } from '../instruments/instruments.component';
import { Note } from '../note';
import { Chord } from '../chord';
import { Scale, eQScale } from '../eQScale';
import adapter from 'webrtc-adapter';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})

export class ListenComponent implements OnInit {
  popularInstruments = INSTRUMENTS;
  currentInstrument = this.popularInstruments[0];   // Default to guitar 

  // 0th pos. of EqualTemperedScale
  currentNote = Object.assign(new Note("A4", 440.00, 78.41));

  notation: string = '';
  frequency: number = 0;
  wavelength: number = 0;
  halfSteps: number = 7; // test value

  // eQScale
  equalTempScale = new eQScale();
    
  constructor() {
    
  }

  ngOnInit(): void {
    this.captureAudio();

    // console.table(this.equalTempScale);
    console.log(this.equalTempScale.findFrequencyUsingNote("A4"));
    console.log(this.equalTempScale.findNoteUsingFrequency("440"));

    
  }

  /**
   * calculateNote()
   * 
   * @param halfSteps - amount of desired half steps away from A4
   * @returns Note name as a string
   */
  calculateFreqFromHalfSteps(halfSteps: number): string {
    var mysteryNote:string = '' // return note calc using input frequency;
    // var halfSteps:number = 0 // use input frequency to calc steps away from 440hz;

    // higher note, halfSteps is positive. 
    // lower note, halfSteps is negative.
    var nHalfSteps:number = halfSteps; // the number of half steps away from A4.

    var freqZero:number = 440.00; // A Note above middle C (A4) base note
    var a = Math.pow(2, (1 / 12)); // 1.059463094359... chromatic scale is base 12. ratio of 1/12 approx from each note

    // Solving for the frequency of the note n half steps away.
    // fn = f0 * (a)^n
    var nFreq = freqZero * Math.pow(a, nHalfSteps);
    nFreq = Number(nFreq.toFixed(2));

    const cSpeedOfSound = 345;

    var nWaveLength = cSpeedOfSound / nFreq;

    // console.log("input: " + halfSteps);
    // console.log("a: " + a.toPrecision(16));
    // console.log("nFreq: " + nFreq.toPrecision(6));
    // console.log("nWaveLength: " + nWaveLength.toPrecision(6));

    mysteryNote = nFreq.toString();
    // mysteryNote = mysteryNote.replace(/\.00([^\d])/g,'$1');

    // console.log(this.equalTempScale.findNoteByFrequency(mysteryNote));

    let calcNote = `${this.equalTempScale.findNoteUsingFrequency(mysteryNote).Note} (${mysteryNote} Hz)`
    
    return calcNote;

  } // --calculateNote()

  
  captureAudio(): void {
    
    const myAudio = document.querySelector('audio');
    const range = document.querySelector('input');
    const freqResponseOutput = document.querySelector('.freq-response-output');
    const userFreqResponseOutput = document.querySelector('.user-freq-response-output');

    // create float32 arrays for getFrequencyReponse
    // const myFrequencyArray = new Float32Array(5);
    // myFrequencyArray[0] = 1000;
    // myFrequencyArray[1] = 2000;
    // myFrequencyArray[2] = 3000;
    // myFrequencyArray[3] = 4000;
    // myFrequencyArray[4] = 5000;
    const magResponseOutput = new Float32Array(5);
    const phaseResponseOutput = new Float32Array(5);

    // getUserMedia block - grab stream
    // put it into a MediaStreamAudioSourceNode
    // also output the visuals into a video element - OPTIONAL
    if (navigator.mediaDevices) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices.getUserMedia ({audio: true, video: false})
      .then(function(stream) {
        myAudio!.srcObject = stream;
        myAudio!.onloadedmetadata = function(e) {
          myAudio?.play();
          myAudio!.muted = true;
        };
      // Create a MediaStreamAudioSourceNode
      // Feed the HTMLMediaElement into it
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);

      // TEST FREQUENCY ===================
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const myFrequencyArray = new Float32Array(bufferLength);
      analyser.getFloatFrequencyData(myFrequencyArray);

      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      

      // var dataArray = new Uint8Array(bufferLength);
      // analyser.getByteFrequencyData(dataArray);
      // for(var i = 0; i < bufferLength; i++) {
      //   console.log(`dataArray: ${dataArray[i]}`);
      // }
      // TEST FREQUENCY ===================


      // Create a biquadfilter
      const biquadFilter = audioCtx.createBiquadFilter();
      biquadFilter.type = "allpass";
      biquadFilter.frequency.value = 1000;
      biquadFilter.gain.value = Number(range!.value);
      source.connect(biquadFilter);
      biquadFilter.connect(audioCtx.destination);
      
      range!.oninput = function() {
        biquadFilter.gain.value = Number(range!.value);
      }
      
      function calcFrequencyResponse() {
        biquadFilter.getFrequencyResponse(myFrequencyArray,magResponseOutput,phaseResponseOutput);
        for (let i = 0; i <= myFrequencyArray.length-1;i++){
            let listItem = document.createElement('li');
            listItem.innerHTML = '<strong>' + myFrequencyArray[i] + 'Hz</strong>: Magnitude ' + magResponseOutput[i] + ', Phase ' + phaseResponseOutput[i] + ' radians.';
            freqResponseOutput!.appendChild(listItem);
        }
      }
      function calcUserFrequencyResponse() {
        biquadFilter.getFrequencyResponse(myFrequencyArray,magResponseOutput,phaseResponseOutput);
        for (let i = 0; i <= myFrequencyArray.length-1;i++){
            let listItem = document.createElement('li');
            listItem.innerHTML = '<strong>' + myFrequencyArray[i] + 'Hz</strong>: Magnitude ' + magResponseOutput[i] + ', Phase ' + phaseResponseOutput[i] + ' radians.';
            freqResponseOutput!.appendChild(listItem);
        }
      }
    //  calcFrequencyResponse();
    })
    .catch(function(err) {
      console.log('The following gUM error occured: ' + err);
    });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }

  } // --captureAudio()

  

} // --ListenComponent();
