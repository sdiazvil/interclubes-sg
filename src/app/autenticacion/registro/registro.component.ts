import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../../core/auth.service';
import { VecindariosService } from '../../core/vecindarios.service';
export class ValidacionContrasena {
  static verificarContrasena(AC: AbstractControl) {
    let contrasena = AC.get('contrasena').value;
    let confirmarContrasena = AC.get('confirmar').value;
    if (contrasena != confirmarContrasena) {
      AC.get('confirmar').setErrors({ verificarContrasena: true })
    } else {
      return null
    }
  }
}
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, AfterViewInit {
  dirty = true;
  formulario: FormGroup;
  datos: any;
  cargando = false;
  mensaje: string;
  icono: string;
  clase: string;
  formErrores = {
    'email': '',
    'contrasena': '',
    'nombre': '',
    'fecha_nac': '',
    'genero': '',
    'vecindario': '',
  }
  hide: boolean = true;
  oculto: boolean = true;
  mensajeError = false;
  respuesta: any;
  mensajesValidacion = {
    'email': {
      'required': 'Email obligatorio',
      'email': 'Introduzca una dirección email correcta'
    },
    'contrasena': {
      'required': 'Contraseña obligatoria',
      'pattern': 'La contraseña debe tener al menos una letra y un número ',
      'minlength': 'y más de 6 caracteres'
    },
    'nombre': {
      'required': 'El Nombre es obligatorio ',
    },
    'fecha_nac': {
      'required': 'La fecha es obligatoria',
      'formatoInvalido': 'El formato es DD-MM-YYYY',
      'fechaPosterior': 'La fecha es posterior a hoy.',
      'dieciocho': 'Debes ser mayor de 14 años.',
      'cien': 'Tienes más de 120 años?',
    },
    'genero': {
      'required': 'El Género es obligatorio.',
    },
    'vecindario': {
      'required': 'La comunidad es obligatoria',
    },
  }
  vecindarios: any = this.vs.getVecindarios();
  constructor(public snackBar: MatSnackBar, private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRouter: ActivatedRoute, private vs: VecindariosService) {
  }
  ngOnInit() {
    this.formulario = this.formBuilder.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'vecindario': ['', [
        Validators.required,
      ]
      ],
      'contrasena': ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6)
      ]
      ],
      'confirmar': ['', [
        Validators.required,
      ]
      ],
      'nombre': ['', [
        Validators.required,
      ]
      ],
      'fecha_nac': ['', [this.dateValidator,
      Validators.required, 
      ]
      ],
      'genero': ['', [
        Validators.required,
      ]
      ]
    },
      {
        validator: ValidacionContrasena.verificarContrasena
      }
    );
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
  }
  dateValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      const date = moment(control.value, 'DD-MM-YYYY', true);
      const today = moment();
      const hoy = moment();
      const hoydia = moment();
      const dieciocho = hoy.subtract(14, "years");
      const cien = hoydia.subtract(120, "years");
      if (!date.isValid()) {
        return { 'formatoInvalido': true }
      }
      if (date.isAfter(today)) {
        return { 'fechaPosterior': true }
      }
      if (date.isAfter(dieciocho)) {
        return { 'dieciocho': true }
      }
      if (date.isBefore(cien)) {
        return { 'cien': true }
      }
    }
    return null;
  }
  ngAfterViewInit() {
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
  enviar() {
    this.cargando = true;
    this.datos = this.crearJSON();
    this.authService.registroUsuario(this.datos).then(ref => {
      this.snackBar.open('El usuario ha sido registrado correctamente, pronto serás transferido.', 'CERRAR', {
        duration: 4000
      });
      this.router.navigate(['/']);
    })
      .catch((error) => {
        this.snackBar.open('El correo electrónico ya se encuentra registrado.', 'CERRAR', {
          duration: 4000
        });
        this.cargando = false;
      });
  }
  crearJSON() {
    const crearJSON = {
      email: this.formulario.get('email').value,
      password: this.formulario.get('contrasena').value,
      displayName: this.formulario.get('nombre').value,
      fecha_nac: this.formulario.get('fecha_nac').value,
      genero: this.formulario.get('genero').value,
      vecindarioId: this.formulario.get('vecindario').value.id,
      pendientes: this.formulario.get('vecindario').value.pendientes
    };
    return crearJSON;
  }
  ingresarGoogle() {
    this.authService.googleLogin();
  }
  ingresarFacebook() {
    this.authService.facebookLogin();
  }
  ingresarTwitter() {
    this.authService.twitterLogin();
  }
}
