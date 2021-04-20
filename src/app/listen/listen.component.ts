import { Component, OnInit } from '@angular/core';
import { Instrument } from '../instrument';
import { INSTRUMENTS } from '../instruments';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})
export class ListenComponent implements OnInit {

  selectedInstrument?: Instrument;
  onSelect(instrument: Instrument): void {
    this.selectedInstrument = instrument;
  }

  instruments = INSTRUMENTS;

  constructor() { }

  ngOnInit(): void {
  }

}
