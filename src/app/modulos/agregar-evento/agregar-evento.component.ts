import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { EventosService } from '../../core/eventos.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
// import * as firebase from 'firebase';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AngularFireStorage } from 'angularfire2/storage';

//UPLOAD MULTI
import * as _ from 'lodash';
import { ArchivoTres } from '../../interfaces/archivo-tres';
import * as moment from 'moment';

@Component({
  selector: 'app-agregar-evento',
  templateUrl: './agregar-evento.component.html',
  styleUrls: ['./agregar-evento.component.css'],
})
export class AgregarEventoComponent implements OnInit {
  time = {hour: 13, minute: 30};
  // foto: Observable<string>;
  eventoId;
  eventoActual: any;
  // UPLOAD MULTI
  listaArchivos: ArchivoTres;
  loading = false;

  fotos: any;

  // @Input() id;

  formulario: FormGroup;

  cargando = false;
  iconoCat;

  formErrores = {
    'fecha': '',
    'hora': '',
    'descripcion': '',
    'nombre': '',
    'lugar': '',
    'tipo': '',
  }

  mensajeError = false;

  mensajesValidacion = {

    'fecha': {
      'required': 'Requerido',
      'formatoInvalido': 'El formato es DD-MM-YYYY',
      // undefined: 'El formato es DD-MM-YYYY',
      'fechaAnterior': 'La fecha es anterior al dia de hoy.',
    },
    'hora': {
      'required': 'Requerido',
    },
    'descripcion': {
      'required': 'Requerido',
      'maxlength': 'Máximo 3000 caracteres.',
    },
    'nombre': {
      'required': 'Requerido',
      'maxlength': 'Máximo 100 caracteres.',
    },
    'lugar': {
      'required': 'Requerido',
      'maxlength': 'Máximo 200 caracteres.',

    },
    'tipo': {
      'required': 'Requerido',

    }
  }

  constructor(private storage: AngularFireStorage, private es: EventosService, public activeModal: NgbActiveModal, public snackBar: MatSnackBar, private router: Router, public authService: AuthService, private fb: FormBuilder) {

  }

  ngOnInit() {

    this.formulario = this.fb.group({
      'fecha': ['',[this.dateValidator,Validators.required]],
      'hora': ['', Validators.required],
      'descripcion': ['', [Validators.required, Validators.maxLength(3000)]],
      'tipo': ['', [Validators.required]],
      'nombre': ['', [Validators.required, Validators.maxLength(100)]],
      'lugar': ['', [Validators.maxLength(200)]],
    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();

    this.eventoActual = "";
    
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
    if (this.eventoId) {
      this.es.actualizar(this.eventoId,
        {
          fecha: this.fecha.value,
          hora: this.hora.value,
          descripcion: descripcion_con_espacio || null,
          nombre: this.nombre.value,
          lugar: this.lugar.value,
          oculto: false,
          creado: this.es.timestamp,
          archivos: [],
          tipo: this.tipo.value,
          vecindarioId: this.authService.vecindarioId

        }
      );
    } else {
      this.es.agregar(
        {
          fecha: this.fecha.value,
          hora: this.hora.value,
          descripcion: descripcion_con_espacio || null,
          nombre: this.nombre.value,
          lugar: this.lugar.value,
          oculto: false,
          creado: this.es.timestamp,
          fotos: [],
          archivos: [],
          tipo: this.tipo.value,
          vecindarioId: this.authService.vecindarioId
        }
      );
    }

    this.snackBar.open('El evento ha sido agregado correctamente.', 'CERRAR', {
      duration: 4000
    });
    this.activeModal.close('Publicar y Cerrar');
  }


  cerrarModal(fotos: Array<any>) {
    //console.log(this.eventoId);
    if (this.eventoId) {
      fotos.forEach(foto => {
        this.storage.ref(foto.path).delete();
      });
      this.es.eliminar(this.eventoId);
      this.activeModal.close();
    } else {
      this.activeModal.close();
    }
  }


  cerrarModalSF() {
    this.activeModal.close();
  }

  cargaMultipleVacio(event: FileList) {
    var arreglo: Array<any> = [];
    this.loading = true;
    this.es.crearVacio().then(ref => {
      this.eventoId = ref.id;
      //console.log('Added document with ID: ', this.eventoId);
      let archivos = event;
      let archivosIndex = _.range(archivos.length)
      _.each(archivosIndex, (index) => {
        this.listaArchivos = new ArchivoTres(archivos[index]);
        this.listaArchivos.eventoId = this.eventoId;
        this.es.cargar(this.listaArchivos, arreglo);
        this.eventoActual = this.es.getPorId(this.eventoId);
      });

    });

    setTimeout(() => {
      this.loading = false;
    }, 3000);

    // this.loading = false;    
  }


  cargaMultipleFotos(event: FileList, arreglo: Array<any>) {
    this.loading = true;

    let archivos = event;
    let archivosIndex = _.range(archivos.length)
    _.each(archivosIndex, (index) => {
      this.listaArchivos = new ArchivoTres(archivos[index]);
      this.listaArchivos.eventoId = this.eventoId;
      this.es.cargar(this.listaArchivos, arreglo);
    });

    setTimeout(() => {
      this.loading = false;
    }, 3000);

    // this.loading = false;    
  }

  eliminarFoto(arreglo: Array<any>, path: string) {
    //console.log(arreglo)

    arreglo = arreglo.filter(item => item.path !== path);

    this.storage.ref(path).delete();

    this.es.actualizar(this.eventoId,
      { fotos: arreglo }
    );

  }

  cambiarPrincipal(url:string){
    this.es.actualizar(this.eventoId,
    {
      principal: url
    })
  }



}
