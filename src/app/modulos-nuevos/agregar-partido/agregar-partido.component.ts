import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import { PartidosService } from '../../core/partidos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-agregar-partido',
  templateUrl: './agregar-partido.component.html',
  styleUrls: ['./agregar-partido.component.css']
})
export class AgregarPartidoComponent implements OnInit {
  formulario: FormGroup;

  formErrores = {
    'jugador1': '',
    'jugador2': '',
    'descripcion': '',
    'nombre': '',
    'cancha': '',
  }
  mensajeError = false;
  mensajesValidacion = {
    'fecha': {
      'required': 'Requerido',
      'formatoInvalido': 'El formato es DD-MM-YYYY',
      'fechaAnterior': 'La fecha es anterior al dia de hoy.',
    },
    'hora': {
      'required': 'Requerido',
    },
    'descripcion': {
      'required': 'Requerido',
      'maxlength': 'Máximo 3000 caracteres.',
    },
    'jugador1': {
      'required': 'Requerido',
      'maxlength': 'Máximo 100 caracteres.',
    },
    'jugador2': {
      'required': 'Requerido',
      'maxlength': 'Máximo 100 caracteres.',
    },
    'cancha': {
      'required': 'Requerido',
    }
  }

  cargando = false;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public partidosService: PartidosService

  ) { }


  ngOnInit() {
    this.formulario = this.fb.group({
      'jugador1': ['', [Validators.required, Validators.maxLength(100)]],
      'jugador2': ['', [Validators.required, Validators.maxLength(100)]],
      'fecha': ['', [this.dateValidator, Validators.required]],
      'hora': ['', Validators.required],
      'cancha': ['', [Validators.maxLength(200)]],
    });
  }

  dateValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      const date = moment(control.value);
      const fecha = moment(control.value);
      const today = moment();
      if (!fecha.isValid()) {
        return { 'formatoInvalido': true }
      }
      if (date.isBefore(today)) {
        return { 'fechaAnterior': true }
      }
    }
    return null;
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
  get fecha() { return this.formulario.get('fecha') }
  get hora() { return this.formulario.get('hora') }
  get descripcion() { return this.formulario.get('descripcion') }
  get nombre() { return this.formulario.get('nombre') }
  get lugar() { return this.formulario.get('lugar') }
  get tipo() { return this.formulario.get('tipo') }

  agregar() {
    this.cargando = true;
    var descripcion_con_espacio = this.descripcion.value.replace(new RegExp('\n', 'g'), "<br>");
    this.partidosService.agregarPartido(
      {
        fecha: this.fecha.value,
        hora: this.hora.value,
        descripcion: descripcion_con_espacio || null,
        nombre: this.nombre.value,
        lugar: this.lugar.value,
        oculto: false,
        archivos: [],
        tipo: this.tipo.value,
      }
    );
    this.snackBar.open('El partido ha sido agregado correctamente.', 'CERRAR', {
      duration: 4000
    });
  }

  cerrarModalSF() {
    this.activeModal.close();
  }
}

