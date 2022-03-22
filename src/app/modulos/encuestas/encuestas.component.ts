import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/auth.service';
import { EncuestasService } from '../../core/encuestas.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { AgregarEncuestaComponent } from '../agregar-encuesta/agregar-encuesta.component';
@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.css']
})
export class EncuestasComponent implements OnInit, OnDestroy {
  encuestas: any;
  mostrarVisibles = true;
  maximo = 6;
  vecindario:any;
  constructor(public vs: VecindariosService, public snackBar: MatSnackBar, public authService: AuthService, private es: EncuestasService, private modalService: NgbModal) {
  }
  ngOnInit() {
    this.encuestas = this.es.getEncuestasVisibles(this.authService.vecindarioId);
    this.vecindario = this.vs.getVecindario(this.authService.vecindarioId);
  }
  open() {
    const modalRef = this.modalService.open(AgregarEncuestaComponent);
  }
  eliminar(encuestaId: string) {
    this.es.eliminar(encuestaId);
    this.snackBar.open('La encuesta ha sido eliminada correctamente.', 'CERRAR', {
      duration: 4000
    });
  }
  toggleEncuestas(visibles: boolean) {
    if (visibles) {
      this.encuestas = this.es.getEncuestasVisibles(this.authService.vecindarioId);
      this.mostrarVisibles = true;
      this.maximo = 4;
    }
    if (!visibles) {
      this.encuestas = this.es.getEncuestasOcultas(this.authService.vecindarioId);
      this.mostrarVisibles = false;
      this.maximo = 4;
    }
  }
  toggleOculto(oculto: boolean, id: string) {
    if (oculto) {
      this.es.actualizar(id,
        {
          oculto: true,
        }
      );
    } if(!oculto) {
      this.es.actualizar(id,
        {
          oculto: false,
        }
      );
    }
  }
  ngOnDestroy() {
  }
  cargarMas() {
    this.maximo += 6;
  }
  checkAdminBarrio(admins: Array<any>, user: any): boolean {
    return admins = admins.find(item =>
      item.userId == user.uid
    )
  }
}
