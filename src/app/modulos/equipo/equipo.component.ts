import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { EquipoService } from '../../core/equipo.service';
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
  }
  cambiarPosicion(pos: number, userId) {
    this.es.actualizar(userId, 
    {
      posicion: +pos 
    })
  }
}
