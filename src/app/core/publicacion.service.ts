import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Publicacion } from '../interfaces/publicacion';

// interface Publicacion {
//   categoria: string;
//   titulo: string;
//   descripcion: string;
//   id?: any;
//   fecha?: number;
//   publicadopor?: string;
//   megusta?: number;
//   icono?: string,
//   precio: string;
//   fono: string;
//   movil: string;
//   email: string;
// }

@Injectable()
export class PublicacionService {

  publicacionesCol: AngularFirestoreCollection<Publicacion>;
  publicacionDocument: AngularFirestoreDocument<Publicacion>

  constructor(private afs: AngularFirestore) {
    this.publicacionesCol = this.afs.collection('publicaciones', ref => ref.orderBy('fecha', 'desc').limit(5))
    // this.noteDocument = this.afs.doc('notes/mtp1Ll6caN4dVrhg8fWD');
  }

  getData(): Observable<Publicacion[]> {
    return this.publicacionesCol.valueChanges();
  }

  getSnapshot() {
    // ['added', 'modified', 'removed']
    return this.publicacionesCol.snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getMySnapshot(id: string) {
    // ['added', 'modified', 'removed']
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
      // fecha: new Date().getTime(),
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
      descripcion: texto,
      megusta: 0,
      publicadopor: idowner,
      publicado: false,
      // whatsapp: whatsapp,
    }
    return this.publicacionesCol.add(publicacion);
  }

  crearPub() {
    const publicacion: Publicacion = {
      // fecha: new Date().getTime(),
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
      descripcion: " ",
      megusta: 0,
      // publicadopor: userId,
      publicado: false,
      fotos: false
      // whatsapp: whatsapp,
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
