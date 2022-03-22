import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { EquipoService } from '../../core/equipo.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {

  chequeado = false;

  usuarios$: Observable<any[]>;

  constructor(private modalService: NgbModal, public es: EquipoService, public authService: AuthService) { }

  ngOnInit() {
    this.usuarios$ = this.es.getEquipo();


  }

  abrirModal() {

    // const modalRef = this.modalService.open();
    // modalRef.componentInstance.id = this.id;
  }


  cambiarPosicion(pos: number, userId) {

    // Agregar + al pos para pasar de string a número

    this.es.actualizar(userId, 
    {
      posicion: +pos 
    })
  }

}
