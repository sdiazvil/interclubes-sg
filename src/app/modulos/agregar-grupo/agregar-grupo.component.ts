import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from 'angularfire2/storage';
import * as _ from 'lodash';
import { AuthService } from '../../core/auth.service';
import { CategoriasService } from '../../core/categorias.service';
import { GruposService } from '../../core/grupos.service';
import { ArchivoSeis } from '../../interfaces/archivo-seis';
@Component({
  selector: 'app-agregar-grupo',
  templateUrl: './agregar-grupo.component.html',
  styleUrls: ['./agregar-grupo.component.css']
})
export class AgregarGrupoComponent implements OnInit {
  grupoId;
  grupoActual: any;
  listaArchivos: ArchivoSeis;
  loading = false;
  formulario: FormGroup;
  cargando = false;
  formErrores = {
    'nombre': '',
    'categoria': '',
    'texto': '',
  }
  mensajeError = false;
  mensajesValidacion = {
    'nombre': {
      'required': 'Requerido',
      'maxlength': 'Máximo 20 caracteres.',
    },
    'bajada': {
      'required': 'Requerido',
      'maxlength': 'Máximo 300 caracteres.',
    },
    'categoria': {
      'required': 'Requerido',
    },
    'texto': {
      'maxlength': 'Máximo 300 caracteres.',
    }
  }
  categorias$: any;
  constructor(public cgs: CategoriasService, private storage: AngularFireStorage, private gs: GruposService, public activeModal: NgbActiveModal, public snackBar: MatSnackBar, private router: Router, public authService: AuthService, public fb: FormBuilder) { }
  ngOnInit() {
    this.formulario = this.fb.group({
      'nombre': ['', [Validators.maxLength(20), Validators.required]],
      'categoria': ['', [Validators.required]],
      'texto': ['', [Validators.maxLength(300), Validators.required]],
    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
    this.grupoActual = "";
    this.categorias$ = this.cgs.getCategoriasGrupos(this.authService.vecindarioId);
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
  get categoria() { return this.formulario.get('categoria') }
  get texto() { return this.formulario.get('texto') }
  agregar(user: any) {
    this.cargando = true;
    var texto_con_espacio = this.texto.value.replace(new RegExp('\n', 'g'), "<br>");
    if (this.grupoId) {
      this.gs.actualizar(this.grupoId,
        {
          userId: user.uid,
          userRef: this.authService.getUserPub(user.uid).ref,
          nombre: this.nombre.value,
          categoria: this.categoria.value,
          texto: texto_con_espacio,
          creado: this.gs.timestamp,
          integrantes: [],
          comentarios: [],
          enlinea: this.gs.timestamp,
          vecindarioId: this.authService.vecindarioId
        }
      );
    } else {
      this.gs.agregar(
        {
          userId: user.uid,
          userRef: this.authService.getUserPub(user.uid).ref,
          nombre: this.nombre.value,
          categoria: this.categoria.value,
          texto: texto_con_espacio,
          creado: this.gs.timestamp,
          integrantes: [],
          fotos: [],
          comentarios: [],
          enlinea: this.gs.timestamp,
          vecindarioId: this.authService.vecindarioId
        }
      );
    }
    window.location.reload();
    this.snackBar.open('El grupo ha sido creado correctamente.', 'CERRAR', {
      duration: 4000
    });
    setTimeout(() => {
      this.activeModal.close('Cerrar');
    }, 1000);
  }
  cerrarModal(fotos: Array<any>) {
    if (this.grupoId) {
      fotos.forEach(foto => {
        this.storage.ref(foto.path).delete();
      });
      this.gs.eliminar(this.grupoId);
      this.activeModal.close();
    } else {
      this.activeModal.close();
    }
  }
  cerrarModalSF() {
    this.activeModal.close();
  }
  cargaMultipleVacio(event: FileList, user: any) {
    var arreglo: Array<any> = [];
    this.loading = true;
    this.gs.crearVacio(user).then(ref => {
      this.grupoId = ref.id;
      let archivos = event;
      let archivosIndex = _.range(archivos.length)
      _.each(archivosIndex, (index) => {
        this.listaArchivos = new ArchivoSeis(archivos[index]);
        this.listaArchivos.grupoId = this.grupoId;
        this.gs.cargar(this.listaArchivos, arreglo);
        this.grupoActual = this.gs.getPorId(this.grupoId);
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
      this.listaArchivos = new ArchivoSeis(archivos[index]);
      this.listaArchivos.grupoId = this.grupoId;
      this.gs.cargar(this.listaArchivos, arreglo);
    });
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }
  eliminarFoto(arreglo: Array<any>, path: string) {
    arreglo = arreglo.filter(item => item.path !== path);
    this.storage.ref(path).delete();
    this.gs.actualizar(this.grupoId,
      { fotos: arreglo }
    );
  }
  cambiarPrincipal(url: string) {
    this.gs.actualizar(this.grupoId,
      {
        principal: url
      })
  }
}
