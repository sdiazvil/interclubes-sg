import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ContactosService {

  col: AngularFirestoreCollection<any>;
  doc: AngularFirestoreDocument<any>

  constructor(private afs: AngularFirestore) {
    this.col = this.afs.collection('contactos', ref => ref.orderBy('fecha', 'desc').limit(5))
    // this.noteDocument = this.afs.doc('notes/mtp1Ll6caN4dVrhg8fWD');
  }

  getData(): Observable<any[]> {
    return this.col.valueChanges();
  }

  getSnapshot() {
    // ['added', 'modified', 'removed']
    return this.col.snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getMySnapshot(id: string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('contactos', ref => ref.orderBy('fecha', 'desc').where('publicadopor', '==', id)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getContactosLeidos() {
    // ['added', 'modified', 'removed']
    return this.afs.collection('contactos', ref => ref.orderBy('fecha', 'desc').where('leido','==', true)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getContactosNoLeidos() {
    // ['added', 'modified', 'removed']
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
      // fecha: new Date().getTime(),
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
