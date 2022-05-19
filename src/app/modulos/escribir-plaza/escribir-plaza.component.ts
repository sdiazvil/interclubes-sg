import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { CategoriasService } from '../../core/categorias.service';
import { NoticiasService } from '../../core/noticias.service';
import { NotificacionesService } from '../../core/notificaciones.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { ArchivoCuatro } from '../../interfaces/archivo-cuatro';
export interface IlinkPreview {
  description: string;
  image: string;
  title: string;
  url: string;
}
@Component({
  selector: 'app-escribir-plaza',
  templateUrl: './escribir-plaza.component.html',
  styleUrls: ['./escribir-plaza.component.css']
})
export class EscribirPlazaComponent implements OnInit {
  noticiaId;
  noticiaActual: any;
  listaArchivos: ArchivoCuatro;
  loading = false;
  formulario: FormGroup;
  cargando = false;
  formErrores = {
    'nombre': '',
    'bajada': '',
    'categoria': '',
    'texto': '',
    'url': '',
  }
  mensajeError = false;
  mensajesValidacion = {
    'nombre': {
      'required': 'Requerido',
      'maxlength': 'Máximo 200 caracteres.',
    },
    'bajada': {
      'required': 'Requerido',
      'maxlength': 'Máximo 200 caracteres.',
    },
    'categoria': {
      'required': 'Requerido',
    },
    'texto': {
      'maxlength': 'Máximo 3000 caracteres.',
      'required': 'Debes escribir un texto',
    },
    'url': {
      'pattern': 'Ingrese una URL válida.',
    }
  }
  categorias$: any;
  mostrarURL = false;
  private regExHyperlink = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  preview: IlinkPreview = {
    title: '',
    description: '',
    url: '',
    image: ''
  };
  links: Array<IlinkPreview> = [
    {
      title: 'Google',
      description: 'Search the worlds information, including webpages, images, videos and more. Google has many special features to help you find exactly what you are looking for.',
      url: 'https://www.google.com',
      image: 'http://www.google.com/images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png'
    }
  ];
  constructor(private vs: VecindariosService, private http: HttpClient, public cs: CategoriasService,public notiService: NotificacionesService, private storage: AngularFireStorage, private ns: NoticiasService, public snackBar: MatSnackBar, private router: Router, public authService: AuthService, public fb: FormBuilder) { }
  ngOnInit() {
    this.formulario = this.fb.group({
      'nombre': [''],
      'bajada': [''],
      'categoria': ['', [Validators.required]],
      'texto': ['', [Validators.required, Validators.maxLength(3000)]],
      'url': [''],
    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
    this.noticiaActual = "";
    this.categorias$ = this.cs.getCategorias(this.authService.vecindarioId);
  }
  detectarCambios(data?: any) {
    if (!this.formulario) { return; }
    const form = this.formulario;
    for (const field in this.formErrores) {
      this.formErrores[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.mensajesValidacion[field];
        for (const key in control.errors) {
          this.formErrores[field] += messages[key] + ' ';
        }
      }
    }
  }
  get nombre() { return this.formulario.get('nombre') }
  get bajada() { return this.formulario.get('bajada') }
  get categoria() { return this.formulario.get('categoria') }
  get texto() { return this.formulario.get('texto') }
  get url() { return this.formulario.get('url') }
  agregar(user: any) {
    this.cargando = true;
    var texto_con_espacio = this.texto.value.replace(new RegExp('\n', 'g'), "<br>");
    if (this.noticiaId) {
      this.ns.actualizar(this.noticiaId,
        {
          userId: user.uid,
          userRef: this.authService.getUserPub(user.uid).ref,
          categoria: this.categoria.value,
          texto: texto_con_espacio,
          creado: this.ns.timestamp,
          megusta: [],
          comentarios: [],
          url: this.url.value || null,
          vecindarioId: this.authService.vecindarioId
        }
      );
    } else {
      this.ns.agregar(
        {
          userId: user.uid,
          userRef: this.authService.getUserPub(user.uid).ref,
          categoria: this.categoria.value,
          texto: texto_con_espacio,
          creado: this.ns.timestamp,
          megusta: [],
          comentarios: [],
          fotos: [],
          url: this.url.value || null,
          vecindarioId: this.authService.vecindarioId
        }
      );
    }
    this.snackBar.open('La publicación ha sido agregada correctamente.', 'CERRAR', {
      duration: 4000
    });
    setTimeout(() => {
      this.cargando = false;
      this.ns.progreso = null;
      this.noticiaActual = null;
      this.noticiaId = null;
      this.formulario.reset();
      this.ns.mostrarFormulario=false;
      if(this.authService.vecindarioId == 'XlsfFUjwbcuAzeQesPIa'){
        let vecinos:any;
        this.vs.getVecindario('XlsfFUjwbcuAzeQesPIa').subscribe((vecindario:any) => {
          vecinos = vecindario.vecinos;
          vecinos = vecinos.filter(vecino => vecino.userId != user.uid);
          vecinos.forEach(vecino =>{
              this.notiService.agregarNotificacion(vecino.userId);
          });
        });
      }
    }, 1000);
  }
  cerrarModal(fotos: Array<any>) {
    if (this.noticiaId) {
      fotos.forEach(foto => {
        this.storage.ref(foto.path).delete();
      });
      this.ns.eliminar(this.noticiaId);
    } else {
    }
  }
  cerrarModalSF() {
  }
  cargaMultipleVacio(event: FileList, user: any) {
    var arreglo: Array<any> = [];
    this.ns.crearVacio(user).then(ref => {
      this.noticiaId = ref.id;
      let archivos = event;
      let archivosIndex = _.range(archivos.length)
      _.each(archivosIndex, (index) => {
        this.listaArchivos = new ArchivoCuatro(archivos[index]);
        this.listaArchivos.noticiaId = this.noticiaId;
        this.ns.cargar(this.listaArchivos, arreglo);
        this.noticiaActual = this.ns.getPorId(this.noticiaId);
      });
    });
  }
  cargarVideo(event: FileList, user: any) {
    var arreglo: Array<any> = [];
    this.ns.crearVideo(user).then(ref => {
      this.noticiaId = ref.id;
      let archivos = event;
      let archivosIndex = _.range(archivos.length)
      _.each(archivosIndex, (index) => {
        this.listaArchivos = new ArchivoCuatro(archivos[index]);
        this.listaArchivos.noticiaId = this.noticiaId;
        this.ns.subirVideo(this.listaArchivos, arreglo);
        this.noticiaActual = this.ns.getPorId(this.noticiaId);
      });
    });
  }
  cargaMultipleFotos(event: FileList, arreglo: Array<any>) {
    this.loading = true;
    let archivos = event;
    let archivosIndex = _.range(archivos.length)
    _.each(archivosIndex, (index) => {
      this.listaArchivos = new ArchivoCuatro(archivos[index]);
      this.listaArchivos.noticiaId = this.noticiaId;
      this.ns.cargar(this.listaArchivos, arreglo);
    });
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }
  eliminarFoto(arreglo: Array<any>, path: string) {
    arreglo = arreglo.filter(item => item.path !== path);
    this.storage.ref(path).delete();
    this.ns.actualizar(this.noticiaId,
      { fotos: arreglo }
    );
  }
  cambiarPrincipal(url: string) {
    this.ns.actualizar(this.noticiaId,
      {
        principal: url
      })
  }
  getLinkPreview(link: string): Observable<any> {
    const api = 'https://api.linkpreview.net/?key=ffc99c33daf5ac812f452eed51f56ef0&q=' + link;
    return this.http.get(api);
  }
  onPreview() {
    this.getLinkPreview(this.url.value)
      .subscribe(preview => {
        this.preview = preview;
        if (!this.preview.title) {
          this.preview.title = this.preview.url;
        }
      }, error => {
      });
  }
}
