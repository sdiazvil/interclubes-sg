import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { ArchivoDos } from '../interfaces/archivo-dos';
import { AuthService } from './auth.service';
@Injectable()
export class PerfilService {
  private carpeta: string = 'fotos_perfil';
  progreso: any;
  constructor(private afs: AngularFirestore, public auth: AuthService) { }
  cargar(archivo: ArchivoDos) {
    var fecha = new Date().getTime();
    const refStorage = firebase.storage().ref();
    if (archivo.file.type.split('/')[0] !== 'image') {
      console.error('El archivo que intestaste subir no es una imagen.');
      return;
    }
    const cargar =
      refStorage.child(`${this.carpeta}/${fecha}_${archivo.file.name}`).put(archivo.file);
    cargar.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        this.progreso = (cargar.snapshot.bytesTransferred / cargar.snapshot.totalBytes) * 100
      },
      (error) => {
      },
      () => {
        archivo.url = cargar.snapshot.downloadURL
        archivo.name = archivo.file.name
        archivo.path = `${this.carpeta}/${fecha}_${archivo.file.name}`;
        archivo.creado = fecha;
       return this.guardar(archivo);
      }
    );
  }
  private guardar(archivo: ArchivoDos) {
    var data = JSON.parse(JSON.stringify(archivo));
    this.auth.updateUsuario(archivo.userId,
    {
      photoURL: data.url,
      path: data.path
    });
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
