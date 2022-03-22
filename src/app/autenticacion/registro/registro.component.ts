import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocomplete, MatSnackBar } from '@angular/material';
import { AbstractControl } from '@angular/forms';
import { VecindariosService } from '../../core/vecindarios.service';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatAutocompleteTrigger } from '@angular/material'
import * as moment from 'moment';

export class ValidacionContrasena {

  static verificarContrasena(AC: AbstractControl) {
    let contrasena = AC.get('contrasena').value; // to get value in input tag
    let confirmarContrasena = AC.get('confirmar').value; // to get value in input tag
    if (contrasena != confirmarContrasena) {
      // console.log('false');
      AC.get('confirmar').setErrors({ verificarContrasena: true })
    } else {
      // console.log('true');
      return null
    }
  }
}

// export class validarFecha {
//   static dateValidator(AC: AbstractControl) {
//     if (AC && AC.value && !moment(AC.value, 'DD-MM-YYYY', true).isValid()) {
//       return { 'formatoInvalido': true };
//     }
//     return null;
//   }
// }

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
    // 'confirmar': '',

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
    // 'confirmar': {
    //   'required': 'Confirma Contraseña',
    //   'pattern': 'La contraseña debe tener al menos una letra y un número ',
    //   'minlength': 'y más de 6 caracteres'
    // },
    'nombre': {
      'required': 'El Nombre es obligatorio ',
      // 'minlength': 'debe tener más de 16 caracteres'
    },
    'fecha_nac': {
      'required': 'La fecha es obligatoria',
      'formatoInvalido': 'El formato es DD-MM-YYYY',
      'fechaPosterior': 'La fecha es posterior a hoy.',
      'dieciocho': 'Debes ser mayor de 14 años.',
      'cien': 'Tienes más de 120 años?',
      // 'minlength': 'debe tener más de 16 caracteres'
    },
    'genero': {
      'required': 'El Género es obligatorio.',
      // 'minlength': 'debe tener más de 16 caracteres'
    },
    'vecindario': {
      'required': 'La comunidad es obligatoria',
      // 'minlength': 'debe tener más de 16 caracteres'
    },
  }

  vecindarios: any = this.vs.getVecindarios();

  // filteredVecindarios: Observable<any[]>;

  // vecindarios: Vecindario[] = [];

  // id: any;
  // pendientes: any;

  // @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;

  // elegirNombre: any;

  constructor(public snackBar: MatSnackBar, private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRouter: ActivatedRoute, private vs: VecindariosService) {

    // this.vecindarioCtrl = new FormControl();
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
        // Validators.minLength(16)
      ]
      ],
      'fecha_nac': ['', [this.dateValidator,
      Validators.required, 
      // validarFecha.dateValidator
      ]
      ],
      'genero': ['', [
        Validators.required,
        // Validators.minLength(16)
      ]
      ]
    },
      {
        validator: ValidacionContrasena.verificarContrasena // your validation method
      }
    );
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
  }

  // agregarGuion(event: KeyboardEvent) {
  //   let DobVal = this.formulario.controls['fecha_nac'].value;
  //   if (DobVal.length === 2 || DobVal.length === 5) {
  //     this.formulario.controls['fecha_nac'].setValue(DobVal + '-');
  //   }
  // }

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

    // this.activatedRouter.params.forEach((urlParameters) => {
    //   this.id = urlParameters['id'];
    //   console.log(this.id);

    //   setTimeout(() => {
    //     let options = this._auto.autocomplete.options.toArray()
    //     for(var i=0;i<options.length;i++){
    //       if(options[i].value==this.id){
    //         this.formulario.controls['vecindario'].setValue(options[i].value)
    //       }
    //     }
    //   }, 2000);
    // });


    // this.matAutocomplete.options.find(opt => opt.id === '6EsFCynobmuf5I17DY9').select();
    // this.vecindarioCtrl.setValue('Brisas del Norte')
    // this.elegirNombre=this.id;
    // this.formulario.controls['vecindario'].setValue(this.id);
    // this.matAutocomplete._keyManager.setFirstItemActive();
    // this.noticia = this.ns.getPorId(this.id).subscribe(noticia => this.noticia = noticia)
  }

  // agregarId(vecindarioId: any, vecindario: any) {
  //   this.id = vecindarioId;
  //   this.pendientes = vecindario.pendientes
  //   console.log(this.id);
  //   console.log(vecindario);
  // }


  // get nombre() { return this.formulario.get('nombre') }
  // get fechanac() { return this.formulario.get('fechanac') }
  // get direccion() { return this.formulario.get('direccion') }

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
      // this.mensaje = "El usuario ha sido registrado correctamente, pronto serás transferido.";
      // this.icono = "fa fa-check";
      // this.clase = "alert alert-success";
      // setTimeout(() => {
      //   this.router.navigate(['/perfil']);
      // }, 1000);
      this.router.navigate(['/']);

    })
      .catch((error) => {
        this.snackBar.open('El correo electrónico ya se encuentra registrado.', 'CERRAR', {
          duration: 4000
        });
        // this.mensaje = "El correo electrónico ya se encuentra registrado.";
        // this.icono = "fa fa-exclamation";
        // this.clase = "alert alert-danger";
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
    // console.log('vecindarioID: '+this.formulario.get('vecindario').value.id);
    // console.log('pendientes: '+this.formulario.get('vecindario').value.pendientes);
    return crearJSON;
  }

  ingresarGoogle() {
    this.authService.googleLogin();
    // this.router.navigate(['/perfil'])
  }

  ingresarFacebook() {
    this.authService.facebookLogin();
    // this.router.navigate(['/perfil'])
  }

  ingresarTwitter() {
    this.authService.twitterLogin();
    // this.router.navigate(['/perfil'])
  }

}

/** Constants used to fill up our data base. */
// const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//   'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
// const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//   'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//   'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];