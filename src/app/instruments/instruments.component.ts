import { Component, OnInit } from '@angular/core';
import { Instrument, INSTRUMENTS } from '../instrument';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent implements OnInit {

  selectedInstrument?: Instrument;
  onSelect(instrument: Instrument): void {
    this.selectedInstrument = instrument;
  }

  instruments = INSTRUMENTS;

  constructor() { }

  ngOnInit(): void {
  }

}
