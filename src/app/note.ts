// Frequencies for equal-tempered scale, A4 = 440 Hz
// https://pages.mtu.edu/~suits/notefreqs.html

export class Note {
    notation: string = '';
    frequency: number = 0;
    wavelength: number = 0;

    aboutMe() {
        return `Hi, I'm ${this.notation}, frequency ${this.frequency} and from ${this.wavelength}`;
    }
}