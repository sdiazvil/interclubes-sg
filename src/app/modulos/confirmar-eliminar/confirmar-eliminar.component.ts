import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VecindariosService } from '../../core/vecindarios.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';
import { NoticiasService } from '../../core/noticias.service';
import { GruposService } from '../../core/grupos.service';
import { EventosService } from '../../core/eventos.service';
import { RepositorioService } from '../../core/repositorio.service';
import { EncuestasService } from '../../core/encuestas.service';

@Component({
  selector: 'app-confirmar-eliminar',
  templateUrl: './confirmar-eliminar.component.html',
  styleUrls: ['./confirmar-eliminar.component.css']
})
export class ConfirmarEliminarComponent implements OnInit {
  @Input() public vecindario;
  formulario: FormGroup;
  mensaje: string;
  correcto;
  cargando = true;
  users: any;
  noticias: any;
  grupos: any;
  eventos: any;
  carpetas: any;
  encuestas: any;

  constructor(public ens: EncuestasService, public rs: RepositorioService, public es: EventosService, public gs: GruposService, public ns: NoticiasService, private storage: AngularFireStorage, public snackBar: MatSnackBar, public authService: AuthService, public fb: FormBuilder, public activeModal: NgbActiveModal, public vs: VecindariosService) { }

  ngOnInit() {
    this.formulario = this.fb.group({
      'password': [''],
    });
    this.authService.getUsuarios().subscribe(usuarios => this.users = usuarios);
    this.ns.getNoticiasPorVecindario(this.vecindario.id).subscribe(noticias => this.noticias = noticias);
    this.gs.getGruposPorVecindario(this.vecindario.id).subscribe(grupos => this.grupos = grupos);
    this.es.getEventosPorVecindario(this.vecindario.id).subscribe(eventos => this.eventos = eventos);
    this.rs.getCarpetasPorVecindario(this.vecindario.id).subscribe(carpetas => this.carpetas = carpetas);
    this.ens.getEncuestasPorVecindario(this.vecindario.id).subscribe(encuestas => this.encuestas = encuestas);
  }

  get password() { return this.formulario.get('password') }


  cerrarModalSF() {
    this.activeModal.close();
  }

  verificarPassword() {
    var vecindariosArreglo: any;

    if (this.password.value == 'Barbas@260314') {
      //eliminar plaza
      this.noticias.forEach(noticia => {
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
      });
      //eliminar grupos
      this.grupos.forEach(grupo => {
        if (grupo.fotos) {
          grupo.fotos.forEach(foto => {
            this.storage.ref(foto.path).delete();
          });
        }
        this.gs.eliminar(grupo.id);
      });
      //eliminar agenda
      this.eventos.forEach(evento => {
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
      });
      //eliminar documentos
      this.carpetas.forEach(carpeta => {
        if (carpeta.archivos) {
          carpeta.archivos.forEach(archivo => {
            this.storage.ref(archivo.path).delete();
          });
        }
        this.rs.eliminar(carpeta.id);
      });
      //eliminar links
      this.encuestas.forEach(encuesta => {
        this.ens.eliminar(encuesta.id);
      });

      //eliminar usuarios
      this.users.forEach(user => {
        vecindariosArreglo = user.vecindarios;
        vecindariosArreglo = vecindariosArreglo.filter(item => item.vecindarioId !== this.vecindario.id);
        if (user.actual == this.vecindario.id) {
          this.authService.updateUsuario(user.uid, {
            actual: null
          });
        }
        this.authService.updateUsuario(user.uid, {
          vecindarios: vecindariosArreglo
        });
      });

      if(this.vecindario.path_banner_web){
        this.storage.ref(this.vecindario.path_banner_web).delete();
      }
      if(this.vecindario.path_banner_movil){
        this.storage.ref(this.vecindario.path_banner_movil).delete();
      }

      this.vs.eliminar(this.vecindario.id);
      this.activeModal.close();

      this.snackBar.open('La comunidad ha sido eliminada correctamente.', 'CERRAR', {
        duration: 4000
      });
      // this.mensaje = "Contraseña correcta.";
      // setTimeout(() => {
      //   this.mensaje = null;
      // }, 5000);
    } else {
      this.mensaje = "Contraseña incorrecta";
      setTimeout(() => {
        this.mensaje = null;
      }, 5000);

    }
  }



}
