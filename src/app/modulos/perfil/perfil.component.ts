import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import * as _ from 'lodash';
import { AuthService } from '../../core/auth.service';
import { CIUDADES } from '../../interfaces/ciudades';
import { PerfilService } from './../../core/perfil.service';
import { ArchivoDos } from './../../interfaces/archivo-dos';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  loading = false;
  listaArchivos: ArchivoDos;
  fotos: any;
  ciudades = CIUDADES;
  comunas: any;
  mostrar_otro = false;
  formulario: FormGroup;
  cargando = false;
  mensaje: string;
  icono: string;
  clase: string;
  formErrores = {
    'displayName': '',
    'fecha_nac': '',
  }
  mensajeError = false;
  mensajesValidacion = {
    'displayName': {
      'required': 'Su nombre es obligatorio',
      'minlength': 'El nombre debe tener más de 5 caractéres',
      'maxlength': 'El nombre debe tener menos de 50 caracteres.',
    },
    'fecha_nac': {
      'invalidDate': 'La fecha no es válida.',
      'undefined': 'La fecha no es válida.',
    }
  }
  constructor(private storage: AngularFireStorage, public ps: PerfilService, private router: Router, public snackBar: MatSnackBar, public authService: AuthService, public fb: FormBuilder) { }
  ngOnInit() {
    this.formulario = this.fb.group({
      'email': [''],
      'displayName': [''],
      'region': [''],
      'ciudad': [''],
      'fecha_nac': [''],
      'genero': [''],
      'ocupacion': [''],
      'ocupacion_otro': [''],
    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
    this.getComunas();
    this.checkOtro();
  }
  getComunas() {
    this.formulario.get('region').valueChanges.subscribe(value => {
      this.ciudades.forEach(ciudad => {
        if (ciudad.nombre == value) {
          this.comunas = ciudad.comunas;
        }
      });
    });
  }
  checkOtro() {
    this.formulario.get('ocupacion').valueChanges.subscribe(value => {
      if (value == "Otro") {
        this.mostrar_otro = true;
      }
    });
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
  get region() { return this.formulario.get('region') }
  get ciudad() { return this.formulario.get('ciudad') }
  get genero() { return this.formulario.get('genero') }
  get ocupacion() { return this.formulario.get('ocupacion') }
  get ocupacion_otro() { return this.formulario.get('ocupacion_otro') }
  actualizarUser(user) {
    this.cargando = true;
    this.authService.actualizarUsuario(user,
      {
        region: this.region.value || null,
        ciudad: this.ciudad.value || null,
        genero: this.genero.value || null,
        ocupacion: this.ocupacion.value || null,
        ocupacion_otro: this.ocupacion_otro.value || null,
      });
    this.snackBar.open('Tu perfil ha sido actualizado correctamente.', 'CERRAR', {
      duration: 4000
    });
    setTimeout(() => {
      this.cargando = false
    }, 3000);
    return;
  }
  cargaMultiple(evento: FileList, user: any) {
    this.loading = true;
    if (user.path) {
      this.storage.ref(user.path).delete();
    }
    let archivos = evento;
    let archivosIndex = _.range(archivos.length)
    _.each(archivosIndex, (index) => {
      this.listaArchivos = new ArchivoDos(archivos[index]);
      this.listaArchivos.userId = user.uid;
      this.ps.cargar(this.listaArchivos);
    });
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }
}
