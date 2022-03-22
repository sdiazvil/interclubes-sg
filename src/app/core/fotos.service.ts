import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
@Injectable()
export class FotosService {
  private carpeta: string = '/fotosaux';
  fotosauxCol: AngularFirestoreCollection<any>;
  fotosDoc: AngularFirestoreDocument<any>
  constructor(private afs: AngularFirestore) {
    this.fotosauxCol = this.afs.collection('fotosaux', ref => ref.orderBy('fecha', 'desc').limit(5))
  }
    getFotos(publicacionId: string) {
    return this.afs.collection(`fotosaux`, ref => ref.orderBy('creado', 'desc').where('publicacionId', '==', publicacionId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
}
