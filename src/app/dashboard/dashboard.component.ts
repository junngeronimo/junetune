import { Component, OnInit } from '@angular/core';
import { INSTRUMENTS } from '../instruments';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  instruments = INSTRUMENTS;

  constructor() { }

  ngOnInit(): void {
  }

}
