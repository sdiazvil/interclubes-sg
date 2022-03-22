import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, Route, NavigationEnd } from "@angular/router";
import { MENUS } from '../../interfaces/menus'

const SMALL_WIDTH_BREAKPOINT = 1100;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  menus = MENUS;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(private router: Router) { }

  ngOnInit() {

    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
