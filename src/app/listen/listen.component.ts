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
  currentTuning:any;
  currentKeys:any;

  // 0th pos. of EqualTemperedScale
  currentNote = Object.assign(new Note('A4', 440.00, 78.41));

  // test value
  notation = '';
  frequency = 0;
  wavelength = 0;
  halfSteps = 7;

  // equal temperament scale
  equalTempScale;

  // audio stuff
  audioCtx: any;
  source: any;
  stream: any;
  analyser: any;
  gainNode: any;
  sendingAudioData: any;
  // freqBuffer
  freqArray: any;
  updateFrames = 0;
  // audio buffer stuff
  lastRms = 0;
  rmsThreshold = 0.006;
  assessedStringsInLastFrame = false;
  assessStringsUntilTime = 0;

  constructor() {
    this.equalTempScale = new eQScale();
    this.captureAudio();

    for (let note of this.currentInstrument.tuningOctaves) {
      this.currentTuning[note] = {
        offset: Math.round(this.audioCtx.sampleRate / this.equalTempScale.findFrequencyUsingNote(note)),
        difference: 0
      }
    }
    this.currentKeys = Object.keys(this.currentTuning);
  }

  ngOnInit(): void {
    // ** TEST */
    // console.log(`test Scale methods:`);
    // console.log(this.equalTempScale.getAllFrequencies());
    // console.log(this.equalTempScale.getNoteFreqPairs());
    // console.log(this.equalTempScale.getAllNoteNames());
    // console.log(this.equalTempScale.findNoteUsingFrequency("29.14"));
    // console.log(this.equalTempScale.findFrequencyUsingNote("A#0/Bb0"));

  }

  calculateNoteFromFrequency(freq: number): string {

    return this.equalTempScale.findNoteUsingFrequency(freq.toString());
  }

  /**
   * calculateNote()
   * @param halfSteps - amount of desired half steps away from A4
   * @returns Note name as a string
   */
  calculateFreqFromHalfSteps(halfSteps: number): string {
    let mysteryNote = ''; // return note calc using input frequency;
    // var halfSteps:number = 0 // use input frequency to calc steps away from 440hz;

    // higher note, halfSteps is positive.
    // lower note, halfSteps is negative.
    const nHalfSteps = Math.min(Math.max(halfSteps, -57), 50); // the number of half steps away from A4.

    const freqZero = 440.00; // A Note above middle C (A4) base note
    const a = Math.pow(2, (1 / 12)); // 1.059463094359... chromatic scale is base 12. ratio of 1/12 approx from each note

    // Solving for the frequency of the note n half steps away.
    // fn = f0 * (a)^n
    let nFreq = freqZero * Math.pow(a, nHalfSteps);
    nFreq = Number(nFreq.toFixed(2));

    // Calculate wavelength - TODO audio visualizer?
    // const cSpeedOfSound = 345;
    // let nWaveLength = cSpeedOfSound / nFreq;

    mysteryNote = nFreq.toString();

    // Format Note name and freq (Hz)
    return `${this.equalTempScale.findNoteUsingFrequency(mysteryNote)} (${mysteryNote} Hz)`;;
  } // --calculateNote()

  sortStringKeysByDifference(a:string, b:string): number {
    return this.currentTuning[a].difference - this.currentTuning[b].difference;
  }

  autoCorrelateAudioData(time: any): number {

    // Credits to CWilso and dalatantœ

    let searchSize = this.analyser.frequencyBinCount * 0.5; // we only need to compare audio data up to half way point
    let sampleRate = this.audioCtx.sampleRate;
    let offsetKey = null;
    let offset = 0;
    let difference = 0;
    let tolerance = 0.001;
    let rms = 0;
    let rmsMin = 0.008;
    let assesssedStringsInLastFrame = this.assessedStringsInLastFrame;

    // fill up the data
    this.analyser.getFloatTimeDomainData(this.freqArray)

    // root-mean-square (rms)
    // amount of signal in the buffer
    for (let val of this.freqArray) {
      rms += val * val;
    }

    rms = Math.sqrt(rms / this.freqArray.length);

    // little signal in buffer, return to quit
    if (rms < rmsMin)
      return 0;

    // check for new string if vol goes up
    // false, assume string is same as last frame
    if (rms > this.lastRms + this.rmsThreshold)
      this.assessStringsUntilTime = time + 250;

    if (time < this.assessStringsUntilTime) {
    
      // check each string and calc which is most likely candidate for current string being tuned
      // based on difference to the "perfect" tuning.
      for (let note of this.currentInstrument.tuningOctaves) {
        
        offsetKey = this.currentKeys[note];
        offset = this.currentTuning[note].offset;
        difference = 0;
      
        // reset how often string came out as closest
        if (assesssedStringsInLastFrame === false)
          this.currentTuning[offsetKey].difference = 0;

        // peak is now calculated
        // start assessing sample based on peak
        // step through for this string comparing it to a
        // "perfect wave" for this string.
        for (let i = 0; i < searchSize; i++) {
          difference += Math.abs(this.freqArray[i] - this.freqArray[i + offset]);
        }

        difference /= searchSize;

        // weight difference by freq.
        // lower strings get, less preferential treatment (higher offset vals)
        // harmonics can mess things up nicely
        // course correct for harmonics

        this.currentTuning[offsetKey].difference += (difference * offset);
      }

    } else {
      this.assessedStringsInLastFrame = false;
    }

      // if you don't reasses strings,
      // order by string with largest num of matches
      if (assesssedStringsInLastFrame === true && this.assessedStringsInLastFrame === false) {
        this.currentKeys.sort(this.sortStringKeysByDifference);
      }


      // top candidate in string set,
      // figure out what actual offset is from intended target
      // make full sweep from offset - 10 -> offset + 10
      // see how long it takes for this wave to repeat
      // that will be our *actual* freq
      let searchRange = 10;
      let assumedString = this.currentTuning[this.currentKeys[0]];
      let searchStart = assumedString.offset - searchRange;
      let searchEnd = assumedString.offset + searchRange;
      let actualFrequency = assumedString.offset;
      let smallestDifference = Number.POSITIVE_INFINITY;

      for (let s = searchStart; s < searchEnd; s++) {

        difference = 0;

        // for each iteration calc difference of every element of the array
        // data in buffer shoulbe PCM, vals ranging from -1 to 1
        // perfect match = they cancel out
        // real data, so we'll be looking for small amounts
        // below tolerance = perfect match
        //  else, go smallest
        // OR curve match on the data
        for (let i = 0; i < searchSize; i++) {
          difference += Math.abs(this.freqArray[i] - this.freqArray[i + s]);
        }

        difference /= searchSize;

        if (difference < smallestDifference) {
          smallestDifference = difference;
          actualFrequency = s;
        }

        if (difference < tolerance) {
          actualFrequency = s;
          break;
        }
      }

      this.lastRms = rms;
      
      return this.audioCtx.sampleRate / actualFrequency;

  }

  dispatchAudioData(time: any): void {
    
    // Setup next pass here
    // could return early from pass if not a lot of data
    if (this.sendingAudioData)
      requestAnimationFrame(this.dispatchAudioData);

    let frequency = this.autoCorrelateAudioData(time);

    if (frequency === 0) {
      return;
    }

    // convert most active freq. to linear, based on A440
    let dominantFrequency = Math.log2(frequency / 440);

    // figure out how many semitones that equates to
    let semitonesFromA4 = 12 * dominantFrequency;

    // Octave is A440 for 4, start there
    // adjust by num of semitones
    // We're at A, we only need 3 more to push up to octave 5
    // and 9 to drop us to 3.
    let octave = 4 + ((9 + semitonesFromA4) / 12);
    octave = Math.floor(octave);

    // The note is 0 for A, all the way up to 11 for G#
    let note = (12 + (Math.round(semitonesFromA4) % 12)) % 12;

    // send to to relevant area

  }

  captureFreq(): void {
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
    this.freqArray = new Float32Array(bufferLength);
    this.analyser.getFloatFrequencyData(this.freqArray);
    // console.log(this.analyser);

    // for(var i = 0; i < bufferLength; i++) {
    //   userFreqResponseOutput!.innerHTML += `${this.freqArray[i]}, `;
    // }

    const getAverageVolume = (a: number[]): number => {
      const length = a.length;
      let values = 0;
      for (let i = 0; i < length; i++) {
        values += a[i];
      }
      return values / length;
    };

    const update = () => {
      // sched the next update
      // requestAnimationFrame(update);

      // get new freq data
      this.analyser.getFloatFrequencyData(this.freqArray);
      const latestFreq: number = getAverageVolume(this.freqArray);


      console.log(`latestFreq: ${latestFreq}`);

      // update visuals
      // for(var i = 0; i < bufferLength; i++) {
      // tslint:disable-next-line: no-non-null-assertion
      userFreqResponseOutput!.innerHTML += `${latestFreq} Hz<br>`;
      // }
      this.updateFrames++;
      if (this.updateFrames === this.analyser.fftSize / 64) {
        this.updateFrames = 0;
        // tslint:disable-next-line: no-non-null-assertion
        userFreqResponseOutput!.innerHTML = '';
      }
    };

    update();
  }

   /**
    * captureAudio()
    * @returns Initialize the audio stream
    */
  captureAudio(): void {

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
      .then( (stream) => {
        // this.onSuccess(stream)
        /* use the stream */
        this.sendingAudioData = true;
        this.stream = stream;
        console.log(this.stream);
        this.captureFreq();

        const myAudio: any = document.getElementById('player');
        myAudio.srcObject = stream;
        // stream controls on startup
        myAudio.onloadedmetadata = () => {
          myAudio.autoplay = false;
          myAudio.muted = true;
          myAudio.pause();
        };

        // LIST AUDIO DEVICES ===================
        const audioDevices = document.getElementById('.audioDevices');
        const listOfDevices: string[] = [];
        navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          devices.forEach( (device) => {
            // List only default devices used
            if (device !== undefined && device.label.includes('Default')) {
              listOfDevices.push(device.kind + ': ' + device.label);
            }
          });
          // Below media controls, tell user audio input and output devices
          // tslint:disable-next-line: no-non-null-assertion
          audioDevices!.innerHTML =
            `<u>Listening and playing through:</u>
            <br> ${listOfDevices[0]} <br> ${listOfDevices[1]}`;
        })
        .catch( (err) => {
          console.log(err.name + ': ' + err.message);
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
        //       listItem.innerHTML = '<strong>' + myFrequencyArray[i] + 'Hz</strong>: Magnitude ' +
        //          magResponseOutput[i] + ', Phase ' + phaseResponseOutput[i] + ' radians.';
        //
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
