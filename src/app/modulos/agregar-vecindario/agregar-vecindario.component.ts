import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/auth.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { CIUDADES } from '../../interfaces/ciudades';
@Component({
  selector: 'app-agregar-vecindario',
  templateUrl: './agregar-vecindario.component.html',
  styleUrls: ['./agregar-vecindario.component.css']
})
export class AgregarVecindarioComponent implements OnInit {
  formulario: FormGroup;
  cargando = false;
  iconoCat;
  formErrores = {
    'nombre': '',
    'descripcion': '',
    'region': '',
    'comuna': '',
  }
  mensajeError = false;
  mensajesValidacion = {
    'nombre': {
      'required': 'Requerido',
      'maxlength': 'Máximo 100 caracteres.',
    },
    'descripcion': {
      'required': 'Requerido',
      'maxlength': 'Máximo 300 caracteres.',
    },
    'region': {
      'required': 'Requerido',
    },
    'comuna': {
      'required': 'Requerido',
    }
  }
  ciudades = CIUDADES;
  comunas: any;
  constructor(private vs: VecindariosService, public activeModal: NgbActiveModal, public snackBar: MatSnackBar, private router: Router, public authService: AuthService, public fb: FormBuilder) {
  }
  ngOnInit() {
    this.formulario = this.fb.group({
      'nombre': ['', [Validators.required, Validators.maxLength(20)]],
      'descripcion': ['', [Validators.required, Validators.maxLength(300)]],
      'region': ['', [Validators.required]],
      'comuna': ['', [Validators.required]],
    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
    this.getComunas();
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
  get descripcion() { return this.formulario.get('descripcion') }
  get region() { return this.formulario.get('region') }
  get comuna() { return this.formulario.get('comuna') }
  agregar() {
    this.cargando = true;
    var descripcion_con_espacio = this.descripcion.value.replace(new RegExp('\n', 'g'), "<br>");
    this.vs.agregar(
      {
        fecha_creacion: this.vs.timestamp,
        nombre: this.nombre.value,
        descripcion: descripcion_con_espacio || null,
        region: this.region.value,
        comuna: this.comuna.value,
        vecinos: [],
        admin: [],
        pendientes: [],
        comentarios_plaza: true,
        cat_noticias: [{nombre: 'General'}],
        cat_grupos: [{nombre: 'General'}],
      }
    );
    this.snackBar.open('El vecindario ha sido agregado correctamente.', 'CERRAR', {
      duration: 4000
    });
    this.activeModal.close('Publicar y Cerrar');
  }
  cerrarModalSF() {
    this.activeModal.close();
  }
}
