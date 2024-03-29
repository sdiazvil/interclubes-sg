import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
@Injectable()
export class CategoriasService {
  constructor(private afs: AngularFirestore) {
  }
  getCategorias(vecindarioId: string){
   return this.afs.doc(`vecindarios/${vecindarioId}`).valueChanges();
  }
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }
  actualizar(vecindarioId, data) {
    return this.afs.doc(`vecindarios/${vecindarioId}`).update(data)
  }
  getCategoriasGrupos(vecindarioId: string){
   return this.afs.doc(`vecindarios/${vecindarioId}`).valueChanges();
  }
  actualizarGrupos(vecindarioId, data) {
    return this.afs.doc(`vecindarios/${vecindarioId}`).update(data)
  }
}
