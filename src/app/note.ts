// Frequencies for equal-tempered scale, A4 = 440 Hz
// https://pages.mtu.edu/~suits/notefreqs.html

export class Note {
    notation: string = '';
    frequency: number = 0;
    wavelength: number = 0;

    aboutMe() {
        return `Hi, I'm${this.notation}, frequency: ${this.frequency} and wavelength: ${this.wavelength}`;
    }

    constructor(note: string, freq: number, wave: number) {
        this.notation = note;
        this.frequency = freq;
        this.wavelength = wave;
    }

    getNote(): string {
        return this.notation;
    }

    getFrequency(): number {
        return this.frequency;
    }

}


