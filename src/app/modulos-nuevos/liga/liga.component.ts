import { Component, OnInit } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 1100;

@Component({
  selector: 'app-liga',
  templateUrl: './liga.component.html',
  styleUrls: ['./liga.component.css']
})
export class LigaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
