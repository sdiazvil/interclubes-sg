import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { NoticiasService } from '../../core/noticias.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
// import * as firebase from 'firebase';

import { AngularFireStorage } from 'angularfire2/storage';
import { CategoriasService } from '../../core/categorias.service';

//UPLOAD MULTI
import * as _ from 'lodash';
import { ArchivoCuatro } from '../../interfaces/archivo-cuatro';
import { HttpClient } from '@angular/common/http';

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

  // foto: Observable<string>;
  noticiaId;
  noticiaActual: any;
  // UPLOAD MULTI
  listaArchivos: ArchivoCuatro;
  loading = false;

  // @Input() id;

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
      // 'maxlength': 'Máximo 20 caracteres.',
    },
    'texto': {
      'maxlength': 'Máximo 3000 caracteres.',
      'required': 'Debes escribir un texto',
      // 'maxlength': 'Máximo 3000 caracteres.',
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

  constructor(private http: HttpClient, public cs: CategoriasService, private storage: AngularFireStorage, private ns: NoticiasService, public snackBar: MatSnackBar, private router: Router, public authService: AuthService, public fb: FormBuilder) { }

  ngOnInit() {

    this.formulario = this.fb.group({
      'nombre': [''],
      'bajada': [''],
      'categoria': ['', [Validators.required]],
      'texto': ['', [Validators.required, Validators.maxLength(3000)]],
      'url': [''],
      // 'url': ['', [Validators.pattern(this.expression)]],

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
          // nombre: this.nombre.value,
          // bajada: this.bajada.value,
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
          // nombre: this.nombre.value,
          // bajada: this.bajada.value,
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

    // setTimeout(() =>
    //   this.activeModal.close('Publicar y Cerrar'), 100);
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
    }, 1000);
  }


  cerrarModal(fotos: Array<any>) {
    //console.log(this.noticiaId);
    if (this.noticiaId) {
      fotos.forEach(foto => {
        this.storage.ref(foto.path).delete();
      });
      this.ns.eliminar(this.noticiaId);
      // this.activeModal.close();
    } else {
      // this.activeModal.close();
    }
  }

  // cerrarM(fotos: Array<any>) {
  //   console.log(this.noticiaId);
  //   if (this.noticiaId) {
  //     for (var i = 0; i < fotos.length; i++) {
  //       this.storage.ref(fotos[i].path).delete();
  //     }
  //     this.ns.eliminar(this.noticiaId);
  //   }
  //   this.activeModal.close();
  // }

  cerrarModalSF() {
    // this.activeModal.close();
  }

  cargaMultipleVacio(event: FileList, user: any) {
    var arreglo: Array<any> = [];
    this.ns.crearVacio(user).then(ref => {
      this.noticiaId = ref.id;
      //console.log('Added document with ID: ', this.noticiaId);
      let archivos = event;
      let archivosIndex = _.range(archivos.length)
      _.each(archivosIndex, (index) => {
        this.listaArchivos = new ArchivoCuatro(archivos[index]);
        this.listaArchivos.noticiaId = this.noticiaId;
        this.ns.cargar(this.listaArchivos, arreglo);
        this.noticiaActual = this.ns.getPorId(this.noticiaId);
      });
    });
    // this.loading = false;    
  }


  cargarVideo(event: FileList, user: any) {
    var arreglo: Array<any> = [];
    // this.loading = true;
    this.ns.crearVideo(user).then(ref => {
      this.noticiaId = ref.id;
     // console.log('Added document with ID: ', this.noticiaId);
      let archivos = event;
      let archivosIndex = _.range(archivos.length)
      _.each(archivosIndex, (index) => {
        this.listaArchivos = new ArchivoCuatro(archivos[index]);
        this.listaArchivos.noticiaId = this.noticiaId;
        this.ns.subirVideo(this.listaArchivos, arreglo);
        this.noticiaActual = this.ns.getPorId(this.noticiaId);
      });

    });

    // setTimeout(() => {
    //   this.loading = false;
    // }, 3000);

    // this.loading = false;    
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

    // this.loading = false;    
  }

  eliminarFoto(arreglo: Array<any>, path: string) {
    //console.log(arreglo)

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
    // Go to linkpreview.net to get your own key and place it below, replacing <key>
    const api = 'https://api.linkpreview.net/?key=ffc99c33daf5ac812f452eed51f56ef0&q=' + link;

    return this.http.get(api);
  }

  // onPreview(event: any) {
  onPreview() {
    // this.getLinkPreview(event.target.value)
    this.getLinkPreview(this.url.value)
      .subscribe(preview => {
        this.preview = preview;

        if (!this.preview.title) {
          this.preview.title = this.preview.url;
        }

      }, error => {
        // this.preview.url = this.url.value;
        // this.preview.title = this.preview.url;
        console.log(error)
      });
  }

}
