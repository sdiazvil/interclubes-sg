import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Publicacion } from '../interfaces/publicacion';
@Injectable()
export class PublicacionService {
  publicacionesCol: AngularFirestoreCollection<Publicacion>;
  publicacionDocument: AngularFirestoreDocument<Publicacion>
  constructor(private afs: AngularFirestore) {
    this.publicacionesCol = this.afs.collection('publicaciones', ref => ref.orderBy('fecha', 'desc').limit(5))
  }
  getData(): Observable<Publicacion[]> {
    return this.publicacionesCol.valueChanges();
  }
  getSnapshot() {
    return this.publicacionesCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getMySnapshot(id: string) {
    return this.afs.collection('publicaciones', ref => ref.orderBy('fecha', 'desc').where('publicadopor', '==', id)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getPublicacion(id) {
    return this.afs.doc<Publicacion>(`publicaciones/${id}`);
  }
  crearPublicacion(texto: string, idowner: string) {
    const publicacion: Publicacion = {
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
      descripcion: texto,
      megusta: 0,
      publicadopor: idowner,
      publicado: false,
    }
    return this.publicacionesCol.add(publicacion);
  }
  crearPub() {
    const publicacion: Publicacion = {
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
      descripcion: " ",
      megusta: 0,
      publicado: false,
      fotos: false
    }
    return this.publicacionesCol.add(publicacion);
  }
  actualizarPublicacion(id, data) {
    return this.getPublicacion(id).update(data)
  }
  eliminarPublicacion(id) {
    return this.getPublicacion(id).delete()
  }
  crearId() {
    return this.afs.createId();
  }
}
