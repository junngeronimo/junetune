import { Component, OnInit } from '@angular/core';
import { INSTRUMENTS } from '../instrument';
import { Note } from '../note';
import { EQScale, StandardNotes } from '../scale';
import { Tone, Tuning } from '../tuning';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})

export class ListenComponent implements OnInit {
  popularInstruments = INSTRUMENTS; // INSTRUMENTS contains some default tunings
  currentInstrument = this.popularInstruments[0];   // Default to guitar
  currentTuning: Tuning;
  currentKeys:string[];

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
    this.dispatchAudioData = this.dispatchAudioData.bind(this);
    this.sortStringKeysByDifference = this.sortStringKeysByDifference.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);

    this.equalTempScale = new EQScale();
    this.currentTuning = new Tuning();
    this.currentKeys = [];
    // this.captureFreq();
    this.captureAudio();


  }

  ngOnInit(): void {
    //

  }

     /**
    * captureAudio()
    * @returns Initialize the audio stream
    */
  captureAudio(): void {

    // const range:any = document.getElementById('audioVol');
    // const freqResponseOutput = document.querySelector('.freq-response-output');

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
        this.captureFreq();

        requestAnimationFrame(this.dispatchAudioData);

        const myAudio: any = document.getElementById('player');
        myAudio.srcObject = stream;
        // stream controls on startup
        // myAudio.onloadedmetadata = () => {
        //   myAudio.autoplay = false;
        //   myAudio.muted = true;
        //   myAudio.pause();
        // };

        // LIST AUDIO DEVICES ===================
        // const audioDevices = document.getElementById('.audioDevices');
        // const listOfDevices: string[] = [];
        // navigator.mediaDevices.enumerateDevices()
        // .then((devices) => {
        //   devices.forEach( (device) => {
        //     // List only default devices used
        //     if (device !== undefined && device.label.includes('Default')) {
        //       listOfDevices.push(device.kind + ': ' + device.label);
        //     }
        //   });
        //   // Below media controls, tell user audio input and output devices
        //   // tslint:disable-next-line: no-non-null-assertion
        //   audioDevices!.innerHTML =
        //     `<u>Listening and playing through:</u>
        //     <br> ${listOfDevices[0]} <br> ${listOfDevices[1]}`;
        // })
        // .catch( (err) => {
        //   console.log(err.name + ': ' + err.message);
        // });
        // --LIST AUDIO DEVICES ===================

    })
    .catch( (err) => {
      /* handle the error */
      console.error('The following gUM error occured: ' + err);
    });

    } else {
      console.error('getUserMedia not supported on your browser!');
    }

  } // --captureAudio()

  captureFreq(): void {
    const userFreqResponseOutput = document.getElementById('user-freq-response-output');

    // INIT
    this.audioCtx = new AudioContext();
    this.source = this.audioCtx.createMediaStreamSource(this.stream); // microphone
    this.analyser = this.audioCtx.createAnalyser();
    this.gainNode = this.audioCtx.createGain();
    // Analyser + freq data Array
    
    // INIT gainNode and analyser values
    this.gainNode.gain.value = 0;
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0;

    // INIT freqArray buffer
    const bufferLength = this.analyser.frequencyBinCount;
    this.freqArray = new Float32Array(bufferLength);

    // INIT connections
    this.source.connect(this.analyser);
    this.analyser.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    
    // this.analyser.getFloatFrequencyData(this.freqArray);

    // INIT currentTuning with currentInstrument's tune
    for (let note of this.currentInstrument.tuningOctaves) {
      let newTone = new Tone();
      newTone.setNote(note);
      newTone.setOffset(Math.round(this.audioCtx.sampleRate / this.equalTempScale.findFrequencyUsingNote(note)));
      newTone.setDifference(0);
      this.currentTuning.addNote(newTone);
    }
    // INIT our set of note Keys
    this.currentKeys = this.currentTuning.getNotes();
    
    const getAverageVolume = (a: number[]): number => {
      const length = a.length;
      let values = 0;
      for (let i = 0; i < length; i++) {
        values += a[i];
      }
      return values / length;
    };

    // const update = () => {
    //   // sched the next update
    //   // requestAnimationFrame(update);

    //   // get new freq data
    //   this.analyser.getFloatFrequencyData(this.freqArray);
    //   const latestFreq: number = getAverageVolume(this.freqArray);


    //   console.log(`latestFreq: ${latestFreq}`);

    //   // update visuals
    //   // for(var i = 0; i < bufferLength; i++) {
    //   // tslint:disable-next-line: no-non-null-assertion
    //   userFreqResponseOutput!.innerHTML += `${latestFreq} Hz<br>`;
    //   // }
    //   this.updateFrames++;
    //   if (this.updateFrames === this.analyser.fftSize / 64) {
    //     this.updateFrames = 0;
    //     // tslint:disable-next-line: no-non-null-assertion
    //     userFreqResponseOutput!.innerHTML = '';
    //   }
    // };
    // update();

  } // --captureFreq()

  calculateNoteFromFrequency(freq: number): string {

    return this.equalTempScale.findNoteUsingFrequency(freq.toString());
  } // --calculateNoteFromFrequency()

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
    return this.currentTuning.findNote(a).getDifference() - this.currentTuning.findNote(b).getDifference();
  }

  autoCorrelateAudioData(time: any): number {

    // Credits to CWilso and dalatantœ

    let searchSize = this.analyser.frequencyBinCount * 0.5; // we only need to compare audio data up to half way point
    // let sampleRate = this.audioCtx.sampleRate;
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

      this.assessedStringsInLastFrame = true;
    
      // check each string and calc which is most likely candidate for current string being tuned
      // based on difference to the "perfect" tuning.
      for (let note of this.currentInstrument.tuningOctaves) {
        let currNote = this.currentTuning.findNote(note);
        
        // offsetKey = note;
        offset = currNote.getOffset();
        difference = 0;
      
        // reset how often string came out as closest
        if (assesssedStringsInLastFrame === false)
          this.currentTuning.findNote(note).setDifference(0);

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
        this.currentTuning.findNote(note).setDifference(currNote.getDifference() + (difference * offset));
      }

    } else {
      this.assessedStringsInLastFrame = false;
    }

      // if you don't reasses strings,
      // order by string with largest num of matches
      if (assesssedStringsInLastFrame === true && this.assessedStringsInLastFrame === false) {
        this.currentKeys.sort(this.sortStringKeysByDifference);
        // NOTE: Doesn't not enter this statement yet
      }


      // top candidate in string set,
      // figure out what actual offset is from intended target
      // make full sweep from offset - 10 -> offset + 10
      // see how long it takes for this wave to repeat
      // that will be our *actual* freq
      let searchRange = 10;
      let assumedString = this.currentTuning.findNote(this.currentKeys[0]);
      let searchStart = assumedString.getOffset() - searchRange;
      let searchEnd = assumedString.getOffset() + searchRange;
      let actualFrequency = assumedString.getOffset();
      let smallestDifference = Number.POSITIVE_INFINITY;
      // console.log(assumedString);
      // console.log(`searchRange: ${searchRange}, searchSize: ${searchSize}, searchEnd: ${searchEnd}, actualFrequency: ${actualFrequency}, smallestDiff: ${smallestDifference}\n`)

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
    if (this.sendingAudioData === true)
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
    // console.log(this.currentTuning);
    let letterNote = StandardNotes[note];
    console.log('frequency: %d, note/octave: %s%d, note: %d\n', frequency, letterNote, octave, note);
    let closestFreq = Math.round(frequency * 100) / 100;
    console.log(closestFreq.toString());
    // console.log(this.equalTempScale.findNoteUsingFrequency(closestFreq.toString()));
  

  }

  attached() {

    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.onVisibilityChange();
  }

  detached() {
    this.sendingAudioData = false;
  }

  onVisibilityChange(): void {

    if (document.hidden) {
      this.sendingAudioData = false;

      if (this.stream) {
        //Chrome 47+
        this.stream.getAudioTracks().forEach((track:any) => {
          if ('stop' in track) {
            track.stop();
          }
        });

        //Chrome 46-
        if ('stop' in this.stream) {
          this.stream.stop();
        }
      }

      this.stream = null;
    } else {
      this.captureAudio;
    }
  }

} // --ListenComponent();
