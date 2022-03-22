import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { EncuestasService } from '../../core/encuestas.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-agregar-encuesta',
  templateUrl: './agregar-encuesta.component.html',
  styleUrls: ['./agregar-encuesta.component.css']
})
export class AgregarEncuestaComponent implements OnInit {
  hide = true;

  cargando = false;

  formulario: FormGroup;

  formErrores = {
    'nombre': '',
    'descripcion': '',
    'url': '',
  }

  mensajesValidacion = {
    'nombre': {
      'required': 'Requerido',
      'maxlength': 'Máximo 300 caracteres.',
    },
    'descripcion': {
      'maxlength': 'Máximo 3000 caracteres.',
    },
    'url': {
      'required': 'Requerido.',
      'pattern': 'Ingrese una URL válida.',
    }
  }

  private regExHyperlink = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

  constructor(private es: EncuestasService, public activeModal: NgbActiveModal, public snackBar: MatSnackBar, private router: Router, public authService: AuthService, public fb: FormBuilder) { }

  ngOnInit() {

    this.formulario = this.fb.group({

      'nombre': ['', [Validators.required, Validators.maxLength(300)]],
      'descripcion': ['', [Validators.maxLength(3000)]],
      'url': ['', [Validators.required, Validators.pattern(this.regExHyperlink)]],
      'password': [''],

    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();

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
  get url() { return this.formulario.get('url') }
  get password() { return this.formulario.get('password') }


  agregar() {
    this.cargando = true;
    var descripcion_con_espacio = this.descripcion.value.replace(new RegExp('\n', 'g'), "<br>");
    this.es.agregar(
      {
        fecha: this.es.timestamp,
        nombre: this.nombre.value,
        descripcion: descripcion_con_espacio || null,
        url: this.url.value,
        password: this.password.value || null,
        oculto: false,
        vecindarioId: this.authService.vecindarioId
      });

    this.snackBar.open('La encuesta sido agregada correctamente.', 'CERRAR', {
      duration: 4000
    });
    this.activeModal.close('Publicar y Cerrar');
  }


  cerrarModal(publicacionId: string) {
    this.activeModal.close();
  }


}
