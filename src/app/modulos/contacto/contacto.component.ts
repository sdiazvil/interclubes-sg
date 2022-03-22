import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { PAISES } from '../../interfaces/paises';
import { CIUDADES } from '../../interfaces/ciudades'
import { ContactosService } from '../../core/contactos.service';
import { MatSnackBar } from '@angular/material';

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

  // mensaje: string;
  // icono: string;
  // clase: string;

  // errorRut="";
  // errorDv="";

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

    //MAPA
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
      // 'ciudad': ['', [Validators.required]],
      'email': ['', [Validators.required,Validators.email
      ]],
      // 'password': ['', [
      //   Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
      //   Validators.minLength(6),
      //   Validators.maxLength(25)
      // ]
      // ],
      'fono': ['569', [
       Validators.pattern('^[0-9]{10,11}')
      ]
      ],
      // 'genero': ['', [Validators.required]],
      // 'ocupacion': ['', [Validators.required]],
      // 'ocupacion_otro': [''],
      'mensaje': ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
    // this.getComunas();
    // this.checkOtro();

    this.contactos = this.cs.getContactosNoLeidos();
    // this.contactos = this.cs.getContactosNoLeidos();
    // setTimeout(() => {
    //   this.verificarRut();
    // }, 3000);

    // this.verificarRut();

  }

  // verificarRut(){
  //   this.formulario.get('rut').valueChanges.subscribe(value => {
  //     if(value.lenght > 8 || value.lenght < 7){
  //       this.errorRut="Su RUT debe tener 7 y 8 dígitos."
  //     }
  //   });

  // }

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

  // getComunas() {
  //   this.formulario.get('region').valueChanges.subscribe(value => {
  //     this.ciudades.forEach(ciudad => {
  //       if (ciudad.nombre == value) {
  //         this.comunas = ciudad.comunas;
  //       }
  //     });
  //   });
  // }

  // checkOtro() {
  //   this.formulario.get('ocupacion').valueChanges.subscribe(value => {
  //     if (value == "Otro") {
  //       this.mostrar_otro = true;
  //     }
  //   });
  // }

  // gets
  get nombre() { return this.formulario.get('nombre') }
  get email() { return this.formulario.get('email') }
  get fono() { return this.formulario.get('fono') }
  // get region() { return this.formulario.get('region') }
  // get ciudad() { return this.formulario.get('ciudad') }
  // get genero() { return this.formulario.get('genero') }
  // get ocupacion() { return this.formulario.get('ocupacion') }
  // get ocupacion_otro() { return this.formulario.get('ocupacion_otro') }
  get mensaje() { return this.formulario.get('mensaje') }
  get referencia() { return this.formulario.get('referencia') }

  // actualizar(user) {
  //   return this.auth.actualizarUsuario(user,
  //     {
  //       nombres: this.nombres.value,
  //       apellidos: this.apellidos.value,
  //       rut: this.rut.value,
  //       dv: this.dv.value,
  //       fechanac: this.fechanac.value,
  //       pais: this.pais.value,
  //       fono: this.fono.value,
  //     })
  // }

  guardar() {
    this.cargando = true;

    var mensaje_con_espacio = this.mensaje.value.replace(new RegExp('\n', 'g'), "<br>");

    this.cs.crear(this.nombre.value, this.email.value, this.fono.value,this.referencia.value, mensaje_con_espacio);

    this.snackBar.open('Muchas gracias por contactarnos, te responderemos a la brevedad.', 'CERRAR', {
      duration: 4000
    });

    setTimeout(() => {
      this.router.navigate(['/']);
      // this.cargando = false;      
    }, 2000);

  }


  eliminar(contactoId: string) {
    this.cs.eliminar(contactoId);

    this.snackBar.open('El contacto ha sido eliminado correctamente.', 'CERRAR', {
      duration: 4000
    });
  }

  toggleLeidos(leidos: boolean) {
    // console.log(visibles);
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
    // console.log(oculto);
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
