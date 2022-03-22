import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgregarEncuestaComponent } from '../agregar-encuesta/agregar-encuesta.component';
import { EncuestasService } from '../../core/encuestas.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';
import { VecindariosService } from '../../core/vecindarios.service';

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

  // checkVisible() {
  //   this.mostrarVisibles.subscribe(value => {
  //     if (value) {
  //       this.encuestas = this.es.getEncuestasVisibles();
  //     }
  //     if (!value) {
  //       this.encuestas = this.es.getEncuestasOcultas();
  //     }
  //   })
  // }

  open() {
    const modalRef = this.modalService.open(AgregarEncuestaComponent);
    // modalRef.componentInstance.id = this.id;
  }

  eliminar(encuestaId: string) {
    this.es.eliminar(encuestaId);

    this.snackBar.open('La encuesta ha sido eliminada correctamente.', 'CERRAR', {
      duration: 4000
    });
  }

  toggleEncuestas(visibles: boolean) {
    // console.log(visibles);
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
    // console.log(oculto);
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
    // this.mostrarVisibles=true;
    // this.encuestas = this.es.getEncuestasVisibles();
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
