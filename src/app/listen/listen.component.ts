import { Component, OnInit } from '@angular/core';
import { Instrument, INSTRUMENTS } from '../instrument';
import { Note } from '../note';
import { Chord } from '../chord';
import { Scale, eQScale } from '../scale';
import adapter from 'webrtc-adapter';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})

export class ListenComponent implements OnInit {
  popularInstruments = INSTRUMENTS; // INSTRUMENTS contains some default tunings
  currentInstrument = this.popularInstruments[0];   // Default to guitar 

  // 0th pos. of EqualTemperedScale
  currentNote = Object.assign(new Note("A4", 440.00, 78.41));

  // test value
  notation: string = '';
  frequency: number = 0;
  wavelength: number = 0;
  halfSteps: number = 7; 

  // equal temperament scale
  equalTempScale:any;
  
  // audio stuff 
  // COMPLETED: USING DRAW()! TODO: init something that has changing data constantly
  audioCtx:any;
  source:any;
  stream:any;
  analyser:any;
  gainNode:any;
  // myFrequencyArray:any;
  freqArray:any;
  i:number = 0;
      
  constructor() {
    this.equalTempScale = new eQScale();
    this.captureAudio();
    
  }

  ngOnInit(): void {
    

    //** TEST */
    // console.log(`test Scale:`);
    // console.log(this.equalTempScale.getAllFrequencies());
    // console.log(this.equalTempScale.getNoteFreqPairs());
    // console.log(this.equalTempScale.getAllNoteNames());
    // console.log(this.equalTempScale.findNoteUsingFrequency("29.14"));
    // console.log(this.equalTempScale.findFrequencyUsingNote("A#0/Bb0"));

    //** TEST */
    // console.log(`test finding freq/notes`);
    // let test:any[] = this.equalTempScale.getAllFrequencies();

    // test.forEach(e => {
    //   console.log(`freq: ${e}, note: ${this.equalTempScale.findNoteUsingFrequency(e)}`);
    // })

    // test = this.equalTempScale.getAllNoteNames();

    // test.forEach(e => {
    //   console.log(`note: ${e}, freq: ${this.equalTempScale.findFrequencyUsingNote(e)}`);
    // })
  }

  calculateNoteFromFrequency(freq: number) {

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
    var nHalfSteps:number = Math.min(Math.max(halfSteps, -57), 50); // the number of half steps away from A4.

    var freqZero:number = 440.00; // A Note above middle C (A4) base note
    var a = Math.pow(2, (1 / 12)); // 1.059463094359... chromatic scale is base 12. ratio of 1/12 approx from each note

    // Solving for the frequency of the note n half steps away.
    // fn = f0 * (a)^n
    var nFreq = freqZero * Math.pow(a, nHalfSteps);
    nFreq = Number(nFreq.toFixed(2));

    // Calculate wavelength - TODO audio visualizer?
    const cSpeedOfSound = 345;
    var nWaveLength = cSpeedOfSound / nFreq;

    mysteryNote = nFreq.toString();

    // Format Note name and freq (Hz)
    let calcNote = `${this.equalTempScale.findNoteUsingFrequency(mysteryNote)} (${mysteryNote} Hz)`
    
    return calcNote;

  } // --calculateNote()

  autoCorrelateAudioData(time:any) {

    // Credits to CWilso and dalatant

    let searchSize = this.analyser.frequencyBinCount * 0.5; // we only need to compare audio data up to half way point
    let sampleRate = this.audioCtx.sampleRate;
    let offsetKey = null;
    let offset = 0;
    let difference = 0;
    let tolerance = 0.001;
    let rms = 0;
    let rmsMin = 0.08;
    let assesssedStringsInLastFrame 
  }
  
  captureFreq() {
    const userFreqResponseOutput = document.getElementById('user-freq-response-output');

    this.audioCtx = new AudioContext();
    this.source = this.audioCtx.createMediaStreamSource(this.stream);

    // Analyser + freq data Array
    this.analyser = this.audioCtx.createAnalyser();
    // this.analyser.minDecibels = -100;
    // this.analyser.maxDecibels = -30;
    this.analyser.smoothingTimeConstant = 0;
    this.analyser.fftSize = 2048;
    const bufferLength = this.analyser.frequencyBinCount;
    // this.myFrequencyArray = new Float32Array(bufferLength);
    // this.analyser.getFloatFrequencyData(this.myFrequencyArray);

    // Biquadfilter 
    // const biquadFilter = this.audioCtx.createBiquadFilter();
    // biquadFilter.type = "lowpass";
    // biquadFilter.frequency.value = 1000;
    // this.source.connect(biquadFilter); // TODO: this was breaking play/pause/mute of video player
    // biquadFilter.connect(this.audioCtx.destination);

    // GainNode
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0;


    this.source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
    this.freqArray = new Float32Array(bufferLength)
    this.analyser.getFloatFrequencyData(this.freqArray);
    // console.log(this.analyser);

    // for(var i = 0; i < bufferLength; i++) {
    //   userFreqResponseOutput!.innerHTML += `${this.freqArray[i]}, `;
    // }

    let getAverageVolume = (a:number[]):number => {
      let length = a.length;
      let values = 0;
      for (let i = 0; i < length; i++) {
        values += a[i];
      }
      return values / length;
    }

    const update = () => {
      // sched the next update
      // requestAnimationFrame(update);

      

      // get new freq data
      this.analyser.getFloatFrequencyData(this.freqArray);
      let latestFreq:number = getAverageVolume(this.freqArray);


      console.log(`latestFreq: ${latestFreq}`);

      // update visuals
      // for(var i = 0; i < bufferLength; i++) {
      userFreqResponseOutput!.innerHTML += `${latestFreq} Hz<br>`;
      // }
      this.i++;
      if (this.i === this.analyser.fftSize/64) {
        this.i = 0;
        userFreqResponseOutput!.innerHTML = "";
      }
    }

    update();
  }

   /**
   * captureAudio()
   * 
   * @param 
   * @returns Initialize the audio stream
   */
  captureAudio() {
    

    // const range:any = document.getElementById('audioVol');
    // const freqResponseOutput = document.querySelector('.freq-response-output');
    
    // const magResponseOutput = new Float32Array(5);
    // const phaseResponseOutput = new Float32Array(5);

    // getUserMedia block - grab stream
    // put it into a MediaStreamAudioSourceNode
    if (navigator.mediaDevices) {
      console.log('getUserMedia supported.');
      
      // TODO: Get stream controls to work??? - BiquadFilter or something else is playing audio over the stream
      navigator.mediaDevices.getUserMedia({audio: true, video: false}) // make video: true to add video stream
      .then((stream) => { 
        // this.onSuccess(stream) 
        /* use the stream */
        this.stream = stream;
        console.log(this.stream);
        this.captureFreq();
        
        const myAudio:any = document.getElementById('player');
        myAudio.srcObject = stream;
        // stream controls on startup
        myAudio.onloadedmetadata = () => {
          myAudio.autoplay = false;
          myAudio.muted = true;
          myAudio.pause();
        };

        // LIST AUDIO DEVICES ===================
        let audioDevices = document.getElementById(".audioDevices")
        let listOfDevices:string[] = [];
        navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          devices.forEach( (device) => {
            // List only default devices used
            if (device !== undefined && device.label.includes("Default")) 
              listOfDevices.push(device.kind + ": " + device.label);
          })
          // Below media controls, tell user audio input and output devices
          audioDevices!.innerHTML = 
            `<u>Listening and playing through:</u> 
            <br> ${listOfDevices[0]} <br> ${listOfDevices[1]}`;
        })
        .catch( (err) => {
          console.log(err.name + ": " + err.message);
        });
        // --LIST AUDIO DEVICES ===================
        
        // Create a MediaStreamAudioSourceNode
        // Feed the HTMLMediaElement into it
        // let audioCtx = new AudioContext();
        // let source = audioCtx.createMediaStreamSource(stream);

        // TEST FREQUENCY ===================
        // this.analyser = audioCtx.createAnalyser();

        // this.analyser.fftSize = 256;
        // const bufferLength = this.analyser.frequencyBinCount;
        // this.myFrequencyArray = new Float32Array(bufferLength);
        // this.analyser.getFloatFrequencyData(this.myFrequencyArray);

        // // source.connect(this.analyser);
        // this.analyser.connect(audioCtx.destination);      

        // var freqArray = new Uint8Array(bufferLength);
        // this.analyser.getByteFrequencyData(freqArray);
        // console.log(this.analyser);

        // for(var i = 0; i < bufferLength; i++) {
        //   // userFreqResponseOutput!.innerHTML += `${this.myFrequencyArray[i]}, `;
        // }
        // --TEST FREQUENCY ===================


        // CREATE BIQUAD FILTER ===================
        // const biquadFilter = audioCtx.createBiquadFilter();
        // biquadFilter.type = "lowpass";
        // biquadFilter.frequency.value = 1000;
        // biquadFilter.gain.value = Number(range!.value);
        // // source.connect(biquadFilter); // TODO: this was breaking play/pause/mute of video player
        // biquadFilter.connect(audioCtx.destination);
        
        // connects input range to the filter strength
        // range.oninput = function() {
        //   biquadFilter.gain.value = Number(range!.value);
        // }

        // CREATE BIQUAD FILTER ===================
        
        /**
         * calcUserFrequencyResponse
         */
        // function calcUserFrequencyResponse() {
        //   biquadFilter.getFrequencyResponse(myFrequencyArray,magResponseOutput,phaseResponseOutput);
        //   for (let i = 0; i <= myFrequencyArray.length-1;i++){
        //       let listItem = document.createElement('li');
        //       listItem.innerHTML = '<strong>' + myFrequencyArray[i] + 'Hz</strong>: Magnitude ' + magResponseOutput[i] + ', Phase ' + phaseResponseOutput[i] + ' radians.';
        //       freqResponseOutput!.appendChild(listItem);
        //   }
        // } // --calcUserFrequencyResponse();

    })
    .catch( (err) => {
      /* handle the error */
      console.log('The following gUM error occured: ' + err);
      // console.log(err.name + ": " + err.message);
    });
    
    } else {
      console.log('getUserMedia not supported on your browser!');
    }

  } // --captureAudio()

  

} // --ListenComponent();
