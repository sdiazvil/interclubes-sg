import { Component, OnInit } from '@angular/core';
import { PartidosService } from '../../core/partidos.service';
const SMALL_WIDTH_BREAKPOINT = 1100;

@Component({
  selector: 'app-liga',
  templateUrl: './liga.component.html',
  styleUrls: ['./liga.component.css']
})
export class LigaComponent implements OnInit {
  partidos: any;
  constructor(public partidosService: PartidosService) { }

  ngOnInit() {
    this.partidos = this.partidosService.getPartidos();
    console.log(this.partidos)
    // this.partidos = this.partidosService.getPartidos().subscribe((partidos:any) => console.log(partidos));
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
