import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-fecha',
  templateUrl: './fecha.component.html',
  styleUrls: ['./fecha.component.css']
})
export class FechaComponent implements OnInit {
  hoy: any = new Date();
  constructor() { }
  ngOnInit() {
  }
}
