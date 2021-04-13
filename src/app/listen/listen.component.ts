import { Component, OnInit } from '@angular/core';
import { Instrument } from '../instrument';
import { INSTRUMENTS } from '../instruments';
import { TODOS } from '../todos';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})
export class ListenComponent implements OnInit {

  todos = TODOS;

  selectedInstrument?: Instrument;
  onSelect(instrument: Instrument): void {
    this.selectedInstrument = instrument;
  }

  instruments = INSTRUMENTS;

  constructor() { }

  ngOnInit(): void {
  }

}
