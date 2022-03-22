import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { GruposService } from '../../core/grupos.service';
import { ArchivoSiete } from '../../interfaces/archivo-siete';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Query } from '@firebase/firestore-types'

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {
  id: string;
  grupo: any;
  maxCom = -6;
  revMax = 6;
  formulario: FormGroup;
  @ViewChild('panel') public panel: ElementRef;

  imageSrc: any;

  comentarioId;
  comentarioActual: any;
  // UPLOAD MULTI
  listaArchivos: ArchivoSiete;
  loading = false;

  mostrar = false;

  constructor(config: NgbCarouselConfig, public fb: FormBuilder, public authService: AuthService, private gs: GruposService, private activatedRoute: ActivatedRoute) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;

  }

  ngOnInit() {
    this.activatedRoute.params.forEach((urlParameters) => {
      this.id = urlParameters['id'];
      this.grupo = this.gs.getPorId(this.id).subscribe(grupo => this.grupo = grupo)
    });
    this.formulario = this.fb.group({
      'texto': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
    });
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    // setTimeout(() =>
    //   this.panel.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' })
    //   , 1000);

    // this.panel.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });

  }

  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);

     // console.log(file)
    }
  }

  // cargar() {
  //   var fecha = new Date().getTime();
  //   const refStorage = firebase.storage().ref();

  //   // Client-side validation example
  //   if (archivo.file.type.split('/')[0] !== 'image') {
  //     console.error('El archivo que intestaste subir no es una imagen.');
  //     return;
  //   }
    

  // }


  get texto() { return this.formulario.get('texto') }

  meGusta(arreglo: Array<any>, userId: string) {
    //console.log(arreglo)
    arreglo.push({
      userId: userId,
      // numero: 3
    });

    this.gs.actualizar(this.id,
      { megusta: arreglo }
    );
  }

  eliminarMeGusta(arreglo: Array<any>, userId: string) {
    //(arreglo)
    arreglo = arreglo.filter(item => item.userId !== userId)

    this.gs.actualizar(this.id,
      { megusta: arreglo }
    );
  }

  checkMeGusta(arreglo: Array<any>, userId: string): boolean {
    return arreglo = arreglo.find(item =>
      item.userId == userId
    )
  }


  comentar(user: any, arreglo: Array<any>) {

    var texto_con_espacio = this.texto.value.replace(new RegExp('\n', 'g'), "<br>");

    arreglo.push({
      userId: user.uid,
      // photoURL: user.photoURL,
      // displayName: user.displayName,
      comentario: texto_con_espacio,
      fecha: new Date().getTime(),
      id: this.gs.crearId(),
      userRef: this.authService.getUserPub(user.uid).ref,
      // numero: 3
    });

    this.gs.actualizar(this.id,
      { comentarios: arreglo,
        enlinea: this.gs.timestamp,
      }
    );

    this.formulario.reset();

  }

  cargarMas() {
    this.maxCom = this.maxCom - 3;
    this.revMax = this.revMax + 3;
  }

  eliminarComentario(id: string, arreglo: Array<any>) {
    //console.log(arreglo)
    arreglo = arreglo.filter(item => item.id !== id)

    this.gs.actualizar(this.id,
      { comentarios: arreglo }
    );
  }

  mostrarDescripcion() {
    this.mostrar = true;
  }


}
