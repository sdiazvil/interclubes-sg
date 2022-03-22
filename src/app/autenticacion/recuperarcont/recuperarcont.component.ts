import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-recuperarcont',
  templateUrl: './recuperarcont.component.html',
  styleUrls: ['./recuperarcont.component.css']
})
export class RecuperarcontComponent implements OnInit {
  olvidoForm: FormGroup;
  datos: any;
  cargando = false;

  mensaje: string;
  icono: string;
  clase: string;

  passReset: boolean = false;

  formErrores = {
    'email': ''
  }

  mensajesValidacion = {
    'email': {
      'required': 'Email obligatorio',
      'email': 'Introduzca una dirección email correcta'
    }
  }

  detectarCambios(data?: any) {
    if (!this.olvidoForm) { return; }
    const form = this.olvidoForm;
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


  constructor(public snackBar: MatSnackBar, private authService: AuthService, private formBuilder: FormBuilder, ) { }

  ngOnInit() {
    this.olvidoForm = this.formBuilder.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]]
    });
    this.olvidoForm.valueChanges.subscribe(data =>
      this.detectarCambios(data));
    this.detectarCambios();
    this.olvidoForm.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
  }

  enviar() {
    this.cargando = true;
    this.datos = this.crearJSON();
    this.authService.reiniciarCont(this.datos).then(() => {
      this.snackBar.open('Se ha enviado un correo con instrucciones para reestablecer su contraseña.', 'CERRAR', {
        duration: 4000
      });
      // this.mensaje = "Se ha enviado un correo con instrucciones para reestablecer su contraseña.";
      // this.icono = "fa fa-exclamation";
      // this.clase = "alert alert-warning";
      this.cargando = false;      
    })
      .catch((error) => {
        this.snackBar.open('El correo electrónico no se encuentra registrado.', 'CERRAR', {
          duration: 4000
        });
        // this.mensaje = "El correo electrónico no se encuentra registrado.";
        // this.icono = "fa fa-exclamation";
        // this.clase = "alert alert-danger";
        this.cargando = false;
      });
  }

  crearJSON() {
    const crearJSON = {
      email: this.olvidoForm.get('email').value,
    };
    return crearJSON;
  }


}
