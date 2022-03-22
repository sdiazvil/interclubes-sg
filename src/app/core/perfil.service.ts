import { Injectable } from '@angular/core';
import { ArchivoDos } from '../interfaces/archivo-dos';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PerfilService {
  private carpeta: string = 'fotos_perfil';
  progreso: any;
  // fotoUrl: Observable<string>;

  constructor(private afs: AngularFirestore, public auth: AuthService) { }

  cargar(archivo: ArchivoDos) {
    var fecha = new Date().getTime();
    const refStorage = firebase.storage().ref();


    // Client-side validation example
    if (archivo.file.type.split('/')[0] !== 'image') {
      console.error('El archivo que intestaste subir no es una imagen.');
      return;
    }

    const cargar =
      refStorage.child(`${this.carpeta}/${fecha}_${archivo.file.name}`).put(archivo.file);
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
        archivo.path = `${this.carpeta}/${fecha}_${archivo.file.name}`;
        archivo.creado = fecha;
       return this.guardar(archivo);
        // console.log(this.fotoUrl);
      }
    );
  }


  private guardar(archivo: ArchivoDos) {
    var data = JSON.parse(JSON.stringify(archivo));
    // this.afs.collection(`fotos_perfil`).add(data); 
    this.auth.updateUsuario(archivo.userId,
    {
      photoURL: data.url,
      path: data.path
    });
    // console.log(data.url);
    return
  }

  getFotos(userId: string) {
    return this.afs.collection(`fotos_perfil`, ref => ref.where('userId', '==', userId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getFoto(id) {
    return this.afs.doc<any>(`fotos_perfil/${id}`);
  }

  actualizarFoto(id, data) {
    return this.getFoto(id).update(data)
  }

  eliminarFoto(id) {
    return this.getFoto(id).delete()
  }


}
