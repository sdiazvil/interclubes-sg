import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { AuthService } from '../../core/auth.service';

const SMALL_WIDTH_BREAKPOINT = 1100;

@Component({
  selector: 'app-pronto',
  templateUrl: './pronto.component.html',
  styleUrls: ['./pronto.component.css']
})
export class ProntoComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
