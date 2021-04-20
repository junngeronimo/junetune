import { Instrument } from './instrument';

export const INSTRUMENTS: Instrument[] = [
  { id: 11, name: 'Guitar' },
  { id: 12, name: 'Ukulele' },
  { id: 13, name: 'Mandolin' },
  { id: 14, name: 'Banjo' },
  { id: 15, name: 'Violin' },
  { id: 16, name: 'Bass' },
  { id: 17, name: 'Cello' },
  { id: 18, name: 'Custom' }
];


/** TEMPORARY TODO LIST TO DISPLAY AT BOTTOM OF PAGE */
export interface todo {
  item: string;
}

export const TODOS: todo[] = [
{ item: "Ask user for permission to access mic." },
{ item: "Capture audio as input." },
{ item: "Process audio data into numerical frequency." },
{ item: "Convert frequency into a roman musical note along with octave." },
{ item: "Display musical note along with octave ." },
{ item: "Set a default instrument (guitar) for target tuning frequencies (EADGBE)." },
{ item: "Compare input audio with range of frequencies in current instrument." },
{ item: "Display a match if close." },
{ item: "Display distance away from closest heard frequency." },
{ item: "Add in different instrument tunings." },
{ item: "Use cookies to remember what the user picked." },
{ item: "Allow user to pick own tuning." },
{ item: "THERE WILL BE MORE." },

];