import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RepositorioService } from '../../core/repositorio.service';
import { MatSnackBar } from '@angular/material';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-agregar-carpeta',
  templateUrl: './agregar-carpeta.component.html',
  styleUrls: ['./agregar-carpeta.component.css']
})
export class AgregarCarpetaComponent implements OnInit {
  formulario: FormGroup;


  formErrores = {
    'nombre': '',
  }


  mensajesValidacion = {

    'nombre': {
      'required': 'Requerido',
      'maxlength': 'Máximo 50 caracteres.',
    }
  }

  constructor(private authService: AuthService, public fb: FormBuilder, public rs: RepositorioService, public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.formulario = this.fb.group({
      'nombre': ['', [Validators.required, Validators.maxLength(50)]],
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

  agregar() {

    this.rs.agregar(
      {
        nombre: this.nombre.value,
        creado: this.rs.timestamp,
        // id: this.rs.crearId(),
        archivos: [],
        oculto: false,
        vecindarioId: this.authService.vecindarioId
      });

      this.snackBar.open('La carpeta ha sido creada correctamente.', 'CERRAR', {
        duration: 4000
      });
    this.formulario.reset();
  }



}
