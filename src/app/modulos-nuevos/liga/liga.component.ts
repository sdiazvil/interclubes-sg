import { Component, OnInit } from '@angular/core';
import { PartidosService } from '../../core/partidos.service';
import { AuthService } from '../../core/auth.service';
const SMALL_WIDTH_BREAKPOINT = 1100;
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AgregarPartidoComponent } from '../agregar-partido/agregar-partido.component';

@Component({
  selector: 'app-liga',
  templateUrl: './liga.component.html',
  styleUrls: ['./liga.component.css']
})
export class LigaComponent implements OnInit {
  partidos: any;

  animal: string;
  name: string;
  modalOption: NgbModalOptions = {};

  constructor(private modalService: NgbModal,public partidosService: PartidosService, public authService: AuthService) { }

  ngOnInit() {
    this.partidos = this.partidosService.getPartidosByCategoria(1);
    // console.log(this.partidos)
    // this.partidos = this.partidosService.getPartidos().subscribe((partidos:any) => console.log(partidos));
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

  tabSelectionChanged(event) {
    // Get the selected tab
    let selectedTab = event.tab;
    console.log(selectedTab);

    if (selectedTab.textLabel == 'Primera') {
      console.log('Primera');
      this.partidos = this.partidosService.getPartidosByCategoria(1);
    }

    if (selectedTab.textLabel == 'Segunda') {
      this.partidos = this.partidosService.getPartidosByCategoria(2);
      console.log('Segunda');
    }

    if (selectedTab.textLabel == 'Tercera') {
      this.partidos = this.partidosService.getPartidosByCategoria(3);
      console.log('Tercera');
    }

    if (selectedTab.textLabel == 'Cuarta') {
      this.partidos = this.partidosService.getPartidosByCategoria(4);
      console.log('Cuarta');
    }

    if (selectedTab.textLabel == 'Dobles') {
      this.partidos = this.partidosService.getPartidosByCategoria(22);
      console.log('Dobles');
    }

    // Call some method that you want 
    // this.someMethod();
  }

  open() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(AgregarPartidoComponent, this.modalOption);
  }
}
