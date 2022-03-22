import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from 'angularfire2/storage';
import * as _ from 'lodash';
import { AuthService } from '../../core/auth.service';
import { CategoriasService } from '../../core/categorias.service';
import { NoticiasService } from '../../core/noticias.service';
import { ArchivoCuatro } from '../../interfaces/archivo-cuatro';
@Component({
  selector: 'app-agregar-noticia',
  templateUrl: './agregar-noticia.component.html',
  styleUrls: ['./agregar-noticia.component.css']
})
export class AgregarNoticiaComponent implements OnInit {
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
    }
  }
  categorias$: any;
  constructor(public cs: CategoriasService, private storage: AngularFireStorage, private ns: NoticiasService, public activeModal: NgbActiveModal, public snackBar: MatSnackBar, private router: Router, public authService: AuthService, public fb: FormBuilder) { }
  ngOnInit() {
    this.formulario = this.fb.group({
      'nombre': [''],
      'bajada': [''],
      'categoria': ['', [Validators.required]],
      'texto': ['', [Validators.maxLength(3000)]],
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
          vecindarioId: this.authService.vecindarioId
        }
      );
    }
    setTimeout(() =>
      this.activeModal.close('Publicar y Cerrar'), 100);
      this.snackBar.open('La publicación ha sido agregado correctamente.', 'CERRAR', {
        duration: 4000
      });
  }
  cerrarModal(fotos: Array<any>) {
    if (this.noticiaId) {
      fotos.forEach(foto => {
        this.storage.ref(foto.path).delete();
      });
      this.ns.eliminar(this.noticiaId);
      this.activeModal.close();
    } else {
      this.activeModal.close();
    }
  }
  cerrarModalSF() {
    this.activeModal.close();
  }
  cargaMultipleVacio(event: FileList, user:any) {
    var arreglo: Array<any> = [];
    this.loading = true;
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
    setTimeout(() => {
      this.loading = false;
    }, 3000);
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
  cambiarPrincipal(url:string){
    this.ns.actualizar(this.noticiaId,
    {
      principal: url
    })
  }
}
