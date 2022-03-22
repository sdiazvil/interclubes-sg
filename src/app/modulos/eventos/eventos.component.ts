import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AgregarEventoComponent } from '../agregar-evento/agregar-evento.component';
import { EventosService } from '../../core/eventos.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatSnackBar } from '@angular/material';
import { VecindariosService } from '../../core/vecindarios.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  modalOption: NgbModalOptions = {}; // not null!
  eventos: any;
  mostrarVisibles = true;

  maximo = 6;
  vecindario: any;

  // eventos = [
  //   {
  //     nombre: 'Evento de Prueba 1',
  //     fecha: new Date('4/28/18'),
  //     descripcion: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.',
  //     lugar: 'Universidad de Antofagasta',

  //   },

  // ];

  constructor(public vs: VecindariosService, public snackBar: MatSnackBar, private storage: AngularFireStorage, public authService: AuthService, private es: EventosService, private modalService: NgbModal,) { }

  ngOnInit() {
    this.eventos = this.es.getEventosVisibles(this.authService.vecindarioId);
    this.vecindario = this.vs.getVecindario(this.authService.vecindarioId);

  }


  open() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(AgregarEventoComponent, this.modalOption);
    // modalRef.componentInstance.id = this.id;
  }

  // eliminar(eventoId:string){
  //   this.es.eliminar(eventoId);

  // }

  eliminar(evento: any) {

    if (evento.fotos) {
      evento.fotos.forEach(foto => {
        this.storage.ref(foto.path).delete();
      });
    }

    if (evento.archivos) {
      evento.archivos.forEach(archivo => {
        this.storage.ref(archivo.path).delete();
      });
    }

    this.es.eliminar(evento.id);

    this.snackBar.open('El evento ha sido eliminado correctamente.', 'CERRAR', {
      duration: 4000
    });
  }

  toggleEventos(visibles: boolean) {
    // console.log(visibles);
    if (visibles) {
      this.eventos = this.es.getEventosVisibles(this.authService.vecindarioId);
      this.mostrarVisibles = true;
      this.maximo = 4;

    }
    if (!visibles) {
      this.eventos = this.es.getEventosOcultos(this.authService.vecindarioId);
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
    } if (!oculto) {
      this.es.actualizar(id,
        {
          oculto: false,
        }
      );
    }
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
