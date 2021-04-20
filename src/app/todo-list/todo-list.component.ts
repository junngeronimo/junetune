import { Component, OnInit } from '@angular/core';
import { TODOS } from '../todos';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todos = TODOS;

  constructor() { }

  ngOnInit(): void {
  }

}
