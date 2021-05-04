import { Instrument } from './instrument';

export const INSTRUMENTS: Instrument[] = [
  { id: 11, name: 'Guitar', tuning: 'EADGBE', tuningOctaves: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']},
  { id: 12, name: 'Ukulele', tuning: 'GCEA', tuningOctaves: ['G3', 'C4', 'E4', 'A4'] },
  { id: 13, name: 'Mandolin', tuning: 'GDAE', tuningOctaves: ['G3', 'D4', 'A4', 'E5'] },
  { id: 14, name: 'Banjo', tuning: 'GDGBD', tuningOctaves: ['G4', 'D3', 'G3', 'B3', 'D4'] },
  { id: 15, name: 'Violin', tuning: 'GDAE', tuningOctaves: ['G3', 'D4', 'A4', 'E5'] },
  { id: 16, name: 'Bass', tuning: 'EADG', tuningOctaves: ['E1', 'A1', 'D2', 'G2'] },
  { id: 17, name: 'Cello', tuning: 'CGDA', tuningOctaves: ['C2', 'G2', 'D3', 'A3'] },
  { id: 18, name: 'Custom', tuning: '', tuningOctaves: ['G4', 'D3', 'G3', 'B3', 'D4'] }
];