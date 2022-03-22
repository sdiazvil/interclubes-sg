import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { EventosService } from '../../core/eventos.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../core/auth.service';
import { Location } from '@angular/common';

//UPLOAD MULTI
import * as _ from 'lodash';
import { ArchivoCinco } from '../../interfaces/archivo-cinco';
import { ArchivoTres } from '../../interfaces/archivo-tres';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {
  id: string;
  evento;

  cargando = false;
  loading = false;
  listaArchivos: ArchivoCinco;
  listaFotos: ArchivoTres;

  mostrarArchivo=null;

  constructor(public _location: Location, public authService: AuthService, private storage: AngularFireStorage,  public snackBar: MatSnackBar, config: NgbCarouselConfig, private es: EventosService, private activatedRoute: ActivatedRoute) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
  }

  ngOnInit() {
    this.activatedRoute.params.forEach((urlParameters) => {
      this.id = urlParameters['id'];
      this.evento = this.es.getPorId(this.id).subscribe(evento => this.evento = evento)
    });
  }

  cargar(event: FileList, arreglo: Array<any>){
    this.loading = true;

    let archivos = event;
    let archivosIndex = _.range(archivos.length)
    _.each(archivosIndex, (index) => {
      this.listaArchivos = new ArchivoCinco(archivos[index]);
      this.es.cargarArchivo(this.listaArchivos, arreglo, this.id);
    });

    setTimeout(() => {
      this.snackBar.open('Los archivos han sido cargados correctamente.', 'CERRAR', {
        duration: 4000
      });
      this.loading = false;
    }, 3000);

  }

  eliminarArchivo(arreglo: Array<any>, path:string){

    arreglo = arreglo.filter(item => item.path !== path)

    this.storage.ref(path).delete();

    this.es.actualizar(this.id,
      { archivos: arreglo }
    );

    this.snackBar.open('El archivo ha sido eliminado correctamente.', 'CERRAR', {
      duration: 4000
    });

  }

  eliminarFoto(arreglo: Array<any>, path: string) {
   // console.log(arreglo)

    arreglo = arreglo.filter(item => item.path !== path);

    this.storage.ref(path).delete();

    this.es.actualizar(this.id,
      { fotos: arreglo }
    );

    this.snackBar.open('La foto ha sido eliminada correctamente.', 'CERRAR', {
      duration: 4000
    });

  }

  cambiarPrincipal(url:string){
    this.es.actualizar(this.id,
    {
      principal: url
    })
  }

  cargaMultipleFotos(event: FileList, arreglo: Array<any>) {
    this.cargando = true;

    let archivos = event;
    let archivosIndex = _.range(archivos.length)
    _.each(archivosIndex, (index) => {
      this.listaFotos = new ArchivoTres(archivos[index]);
      this.listaFotos.eventoId = this.id;
      this.es.cargar(this.listaFotos, arreglo);
    });

    setTimeout(() => {
      this.snackBar.open('Fotos cargadas correctamente.', 'CERRAR', {
        duration: 4000
      });
      this.cargando = false;
    }, 3000);

    // this.loading = false;    
  }

  mostrar(url: any){
    this.mostrarArchivo = url;
  }



}
