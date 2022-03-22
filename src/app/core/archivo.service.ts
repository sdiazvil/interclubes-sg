import { Injectable } from '@angular/core';
import { Archivo } from '../interfaces/archivo';
import { PublicacionService } from './publicacion.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Injectable()
export class ArchivoService {
  private carpeta: string = 'fotosaux';
  fecha: any;
  progreso: any;

  constructor(public publicacionService: PublicacionService, private afs: AngularFirestore) { }

  subir(archivo: Archivo) {
    this.fecha = new Date().getTime();
    const refStorage = firebase.storage().ref();


     // Client-side validation example
     if (archivo.file.type.split('/')[0] !== 'image') {
      console.error('El archivo que intestaste subir no es una imagen.');
      return;
    }

    const cargar =
    refStorage.child(`${this.carpeta}/${this.fecha}_${archivo.file.name}`).put(archivo.file);
    cargar.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
        // upload in progress
       this.progreso = (cargar.snapshot.bytesTransferred / cargar.snapshot.totalBytes) * 100
        console.log(this.progreso);        
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        archivo.url = cargar.snapshot.downloadURL
        archivo.name = archivo.file.name
        archivo.path = `${this.carpeta}/${this.fecha}_${archivo.file.name}`;
        archivo.creado = this.fecha;
        this.guardar(archivo);
      }
    );
  }


  private guardar(archivo: Archivo) {
    var data = JSON.parse(JSON.stringify(archivo));
    this.afs.collection(`${this.carpeta}/`).add(data);
    this.publicacionService.actualizarPublicacion(archivo.publicacionId, {fotos: true});
  }


}
