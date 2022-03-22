import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ContactosService {
  col: AngularFirestoreCollection<any>;
  doc: AngularFirestoreDocument<any>
  constructor(private afs: AngularFirestore) {
    this.col = this.afs.collection('contactos', ref => ref.orderBy('fecha', 'desc').limit(5))
  }
  getData(): Observable<any[]> {
    return this.col.valueChanges();
  }
  getSnapshot() {
    return this.col.snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getMySnapshot(id: string) {
    return this.afs.collection('contactos', ref => ref.orderBy('fecha', 'desc').where('publicadopor', '==', id)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getContactosLeidos() {
    return this.afs.collection('contactos', ref => ref.orderBy('fecha', 'desc').where('leido','==', true)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getContactosNoLeidos() {
    return this.afs.collection('contactos', ref => ref.orderBy('fecha', 'desc').where('leido','==', false)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  get(id) {
    return this.afs.doc<any>(`contactos/${id}`);
  }
  crear(nombre, email, fono, mensaje, referencia) {
    const arreglo = {
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
      nombre: nombre,
      email: email,
      fono: fono,
      mensaje: mensaje,
      leido: false,
      referencia: referencia
    }
    return this.col.add(arreglo);
  }
  actualizar(id, data) {
    return this.get(id).update(data)
  }
  eliminar(id) {
    return this.get(id).delete()
  }
}
