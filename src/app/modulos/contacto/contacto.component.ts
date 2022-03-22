import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ContactosService } from '../../core/contactos.service';
import { CIUDADES } from '../../interfaces/ciudades';
import { PAISES } from '../../interfaces/paises';
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  ciudades = CIUDADES;
  comunas: any;
  mostrar_otro = false;
  paises = PAISES;
  formulario: FormGroup;
  cargando = false;
  contactos: any;
  formErrores = {
    'nombre': '',
    'email': '',
    'region': '',
    'ciudad': '',
    'fono': '',
    'genero': '',
    'ocupacion': [''],
    'mensaje': [''],
    'referencia': [''],
  }
  mensajesValidacion = {
    'nombre': {
      'required': 'Este campo es requerido',
      'maxlength': 'El nombre tener menos de 50 caracteres.',
    },
    'email': {
      'required': 'Su correo electrónico es requerido.',
      'email': 'Introduzca una dirección de correo correcta.'
    },
    'fono': {
      'required': 'Este campo es requerido',
      'pattern': 'máximo 8-9 números',
    },
    'region': {
      'required': 'Este campo es requerido',
    },
    'ciudad': {
      'required': 'Este campo es requerido',
    },
    'genero': {
      'required': 'Este campo es requerido',
    },
    'ocupacion': {
      'required': 'Este campo es requerido',
    },
    'mensaje': {
      'required': 'Este campo es requerido',
      'maxlength': 'El Mensaje tener menos de 500 caracteres.',
    },
    'referencia': {
      'required': 'Requerido',
    }
  }
    lat: number = -23.702451;
    lng: number = -70.421126;
    zoom: number = 16;
    mostrarLeidos = true;
    maximo = 4;
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder, public authService: AuthService, private router: Router, private cs: ContactosService,) {
  }
  ngOnInit() {
    this.formulario = this.fb.group({
      'nombre': ['', [
        Validators.required,
        Validators.maxLength(50)
      ]
      ],
      'referencia': [''],
      'email': ['', [Validators.required,Validators.email
      ]],
      'fono': ['569', [
       Validators.pattern('^[0-9]{10,11}')
      ]
      ],
      'mensaje': ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
    this.contactos = this.cs.getContactosNoLeidos();
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
  get email() { return this.formulario.get('email') }
  get fono() { return this.formulario.get('fono') }
  get mensaje() { return this.formulario.get('mensaje') }
  get referencia() { return this.formulario.get('referencia') }
  guardar() {
    this.cargando = true;
    var mensaje_con_espacio = this.mensaje.value.replace(new RegExp('\n', 'g'), "<br>");
    this.cs.crear(this.nombre.value, this.email.value, this.fono.value,this.referencia.value, mensaje_con_espacio);
    this.snackBar.open('Muchas gracias por contactarnos, te responderemos a la brevedad.', 'CERRAR', {
      duration: 4000
    });
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }
  eliminar(contactoId: string) {
    this.cs.eliminar(contactoId);
    this.snackBar.open('El contacto ha sido eliminado correctamente.', 'CERRAR', {
      duration: 4000
    });
  }
  toggleLeidos(leidos: boolean) {
    if (leidos) {
      this.contactos = this.cs.getContactosLeidos();
      this.mostrarLeidos = true;
      this.maximo = 4;
    }
    if (!leidos) {
      this.contactos = this.cs.getContactosNoLeidos();
      this.mostrarLeidos = false;
      this.maximo = 4;
    }
  }
  toogleLeido(leido: boolean, id: string) {
    if (leido) {
      this.cs.actualizar(id,
        {
          leido: false,
        }
      );
    } if(!leido) {
      this.cs.actualizar(id,
        {
          leido: true,
        }
      );
    }
  }
  cargarMas() {
    this.maximo += 2;
  }
}
