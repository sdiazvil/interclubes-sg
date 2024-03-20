import { Component, Inject, Input, OnInit } from '@angular/core';
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
  selector: 'app-editar-partido',
  templateUrl: './editar-partido.component.html',
  styleUrls: ['./editar-partido.component.css']
})
export class EditarPartidoComponent implements OnInit {
  @Input() partido: any;

  // time = {hour: 9, minute: 0};

  formulario: FormGroup;

  formErrores = {
    'jugador1': '',
    'jugador2': '',
    'descripcion': '',
    'nombre': '',
    'cancha': '',
    'categoria': '',
    'fecha': '',
    'hora': '',
    'set_1_jugador1': '',
    'set_2_jugador1': '',
    'set_1_jugador2': '',
    'set_2_jugador2': '',
    'set_3_jugador1': '',
    'set_3_jugador2': '',
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
    },
    'categoria': {
      'required': 'Requerido',
    },
    'set_1_jugador1': {
      'required': 'Requerido',
      'max': 'el número máximo es 7',
    },
    'set_2_jugador1': {
      'required': 'Requerido',
      'max': 'el número máximo es 7',
    },
    'set_1_jugador2': {
      'required': 'Requerido',
      'max': 'el número máximo es 7',
    },
    'set_2_jugador2': {
      'required': 'Requerido',
      'max': 'el número máximo es 7',
    },
    'set_3_jugador1': {
      'required': 'Requerido',
    },
    'set_3_jugador2': {
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
      'jugador1': [this.partido.jugador1, [Validators.required, Validators.maxLength(100)]],
      'jugador2': [this.partido.jugador2, [Validators.required, Validators.maxLength(100)]],
      'fecha': [this.partido.fecha, [this.dateValidator, Validators.required]],
      'hora': [this.partido.hora, Validators.required],
      'cancha': [this.partido.cancha.toString(), Validators.required],
      'categoria': [this.partido.categoria.toString(), Validators.required],
      'set_1_jugador1': [this.partido.sets_jugador1[0], [Validators.required, Validators.max(7)]],
      'set_2_jugador1': [this.partido.sets_jugador1[1], [Validators.required, Validators.max(7)]],
      'set_3_jugador1': [this.partido.sets_jugador1[2],Validators.required],
      'set_1_jugador2': [this.partido.sets_jugador2[0], [Validators.required, Validators.max(7)]],
      'set_2_jugador2': [this.partido.sets_jugador2[1], [Validators.required, Validators.max(7)]],
      'set_3_jugador2': [this.partido.sets_jugador2[2], Validators.required],
    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
    console.log(this.partido);
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
  get jugador1() { return this.formulario.get('jugador1') }
  get jugador2() { return this.formulario.get('jugador2') }
  get cancha() { return this.formulario.get('cancha') }
  get categoria() { return this.formulario.get('categoria') }
  get set_1_jugador1() { return this.formulario.get('set_1_jugador1') }
  get set_2_jugador1() { return this.formulario.get('set_2_jugador1') }
  get set_3_jugador1() { return this.formulario.get('set_3_jugador1') }
  get set_1_jugador2() { return this.formulario.get('set_1_jugador2') }
  get set_2_jugador2() { return this.formulario.get('set_2_jugador2') }
  get set_3_jugador2() { return this.formulario.get('set_3_jugador2') }

  editar() {
    this.cargando = true;

    let result = this.validarMarcador([this.set_1_jugador1.value, this.set_2_jugador1.value, this.set_3_jugador1.value], [this.set_1_jugador2.value, this.set_2_jugador2.value, this.set_3_jugador2.value])
    this.partidosService.actualizar(this.partido.id,
      {
        fecha: this.fecha.value,
        hora: this.hora.value,
        jugador1: this.jugador1.value,
        jugador2: this.jugador2.value,
        cancha: Number(this.cancha.value),
        categoria: Number(this.categoria.value),
        sets_jugador1: [this.set_1_jugador1.value, this.set_2_jugador1.value, this.set_3_jugador1.value],
        sets_jugador2: [this.set_1_jugador2.value, this.set_2_jugador2.value, this.set_3_jugador2.value],
        sets_ganados_jugador1: result.sets_ganados_jugador1,
        sets_ganados_jugador2: result.sets_ganados_jugador2,
        ganador: result.ganador
      }
    );
    this.snackBar.open('El partido ha sido editado correctamente.', 'CERRAR', {
      duration: 4000
    });
    this.cerrarModalSF();
  }

  cerrarModalSF() {
    this.activeModal.close();
  }

  validarMarcador(sets_jugador1: any, sets_jugador2: any) {
    let sets_ganados_jugador1 = 0;
    let sets_ganados_jugador2 = 0;
    let ganador = '';
    for (let i = 0; i < sets_jugador1.length; i++) {
      if (sets_jugador1[i] > sets_jugador2[i]) {
        sets_ganados_jugador1++;
      }
      if (sets_jugador1[i] < sets_jugador2[i]) {
        sets_ganados_jugador2++;
      }
    }
    if (sets_ganados_jugador1 > sets_ganados_jugador2) {
      ganador = 'jugador1'
    }
    if (sets_ganados_jugador1 < sets_ganados_jugador2) {
      ganador = 'jugador2'
    }
    if (sets_ganados_jugador1 == sets_ganados_jugador2) {
      ganador = ''
    }
    return {
      ganador: ganador,
      sets_ganados_jugador1: sets_ganados_jugador1,
      sets_ganados_jugador2: sets_ganados_jugador2
    }
  }
}

