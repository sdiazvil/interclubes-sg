import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Router } from "@angular/router";
import { AngularFireStorage } from 'angularfire2/storage';
import * as _ from 'lodash';
import { AuthService } from '../../core/auth.service';
import { EventosService } from '../../core/eventos.service';
import { NoticiasService } from '../../core/noticias.service';
import { NotificacionesService } from '../../core/notificaciones.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { ArchivoOcho } from './../../interfaces/archivo-ocho';
const SMALL_WIDTH_BREAKPOINT = 1100;
@Component({
  selector: 'app-plaza',
  templateUrl: './plaza.component.html',
  styleUrls: ['./plaza.component.css']
})
export class PlazaComponent implements OnInit {
  noticias$: any;
  formulario: FormGroup;
  maxCom = -3;
  revMax = 3;
  maxNoticias = 10;
  mensajeMax: string;
  cargando = true;
  vecindario: any;
  veci: any;
  @ViewChild('sidenav') sidenav: MatSidenav;
  vecindar: any;
  loading = false;
  listaArchivos: ArchivoOcho;
  cargando_movil = false;
  cargando_web = false;
  constructor(public notificacionesService: NotificacionesService,private elementRef: ElementRef, private router: Router, public vs: VecindariosService, private es: EventosService, private storage: AngularFireStorage, public fb: FormBuilder, public snackBar: MatSnackBar, public authService: AuthService, private ns: NoticiasService) {
  }
  ngOnInit() {
    this.noticias$ = this.ns.getNoticiasFiltrable();
    this.vecindario = this.vs.getVecindario(this.authService.vecindarioId);
    this.vecindar = this.vs.getVecindario(this.authService.vecindarioId);
    this.ns.filtroVecindario$.next(this.authService.vecindarioId);
    this.formulario = this.fb.group({
      'texto': ['', [Validators.minLength(1), Validators.maxLength(500)]],
    });
    this.vs.getVecindario(this.authService.vecindarioId).subscribe(vecindario =>
      this.veci = vecindario);
    setTimeout(() => {
      this.cargando = false;
    }, 1000);
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }
  get texto() { return this.formulario.get('texto') }
  ngOnDestroy() {
  }
  toggleOculto(variable: boolean) {
    if (variable) {
      this.vs.actualizarVecindario(this.authService.vecindarioId,
        {
          comentarios_plaza: false,
        }
      );
      this.snackBar.open('Los comentarios han sido desactivados.', 'CERRAR', {
        duration: 4000
      });
    } else {
      this.vs.actualizarVecindario(this.authService.vecindarioId,
        {
          comentarios_plaza: true,
        }
      );
      this.snackBar.open('Los comentarios han sido activados.', 'CERRAR', {
        duration: 4000
      });
    }
  }
  togglePublicacionesPlaza(variable: boolean) {
    if (variable) {
      this.vs.actualizarVecindario(this.authService.vecindarioId,
        {
          publicaciones_plaza: false,
        }
      );
      this.snackBar.open('Las publicaciones de los usuarios han sido desactivadas.', 'CERRAR', {
        duration: 4000
      });
    } else {
      this.vs.actualizarVecindario(this.authService.vecindarioId,
        {
          publicaciones_plaza: true,
        }
      );
      this.snackBar.open('Las publicaciones de los usuarios han sido activadas.', 'CERRAR', {
        duration: 4000
      });
    }
  }
  eliminar(noticia: any) {
    if (noticia.fotos) {
      noticia.fotos.forEach(foto => {
        this.storage.ref(foto.path).delete();
      });
    }
    if (noticia.videos) {
      noticia.videos.forEach(video => {
        this.storage.ref(video.path).delete();
      });
    }
    this.ns.eliminar(noticia.id);
    this.snackBar.open('La publicación ha sido eliminada correctamente.', 'CERRAR', {
      duration: 4000
    });
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }
  meGusta(id: string, arreglo: Array<any>, userId: string) {
    arreglo.push({
      userId: userId,
    });
    this.ns.actualizar(id,
      { megusta: arreglo }
    );
  }
  eliminarMeGusta(id: string, arreglo: Array<any>, userId: string) {
    arreglo = arreglo.filter(item => item.userId !== userId)
    this.ns.actualizar(id,
      { megusta: arreglo }
    );
  }
  checkMeGusta(arreglo: Array<any>, userId: string): boolean {
    return arreglo = arreglo.find(item =>
      item.userId == userId
    )
  }
  comentar(id: string, user: any, arreglo: Array<any>,) {
    var texto_con_espacio = this.texto.value.replace(new RegExp('\n', 'g'), "<br>");
    arreglo.push({
      userId: user.uid,
      comentario: texto_con_espacio,
      fecha: new Date().getTime(),
      id: this.ns.crearId(),
      userRef: this.authService.getUserPub(user.uid).ref,
    });
    this.ns.actualizar(id,
      { comentarios: arreglo }
    );
    this.formulario.reset();
  }
  eliminarComentario(id: string, arreglo: Array<any>, idNoticia: string) {
    arreglo = arreglo.filter(item => item.id !== id)
    this.ns.actualizar(idNoticia,
      { comentarios: arreglo }
    );
  }
  cargarMasNoticias() {
    this.maxNoticias = this.maxNoticias + 10;
  }
  cargarComentarios() {
    this.maxCom = this.maxCom - 5;
    this.revMax = this.revMax + 5;
  }
  itemTrackBy(index: number, item) {
    return item.id;
  }
  comentariosActivos() {
    if (this.veci.comentarios_plaza) {
      return true;
    } else {
      return false;
    }
  }
  checkAdminBarrio(admins: Array<any>, userId: string): boolean {
    return admins = admins.find(item =>
      item.userId == userId
    )
  }
  subirBanner(evento: FileList, vecindario: any, tipo:string) {
    if(tipo == 'Movil'){
      if (vecindario.path_banner_movil) {
        this.storage.ref(vecindario.path_banner_movil).delete();
        this.cargando_movil = true;
      }
    }
    if(tipo == 'Web'){
      if (vecindario.path_banner_web) {
        this.storage.ref(vecindario.path_banner_web).delete();
        this.cargando_web = true;
      }
    }
    let archivos = evento;
    let archivosIndex = _.range(archivos.length)
    _.each(archivosIndex, (index) => {
      this.listaArchivos = new ArchivoOcho(archivos[index]);
      this.listaArchivos.vecindarioId = this.authService.vecindarioId;
      this.listaArchivos.tipo = tipo;
      this.vs.cargar(this.listaArchivos);
    });
    setTimeout(() => {
      this.cargando_movil = false;
      this.cargando_web = false;
      this.snackBar.open('El banner ha sido cargado correctamente.', 'CERRAR', {
        duration: 3000
      });
    }, 3000);
  }
}
