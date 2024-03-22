import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class PartidosService {
  col: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.col = this.afs.collection('partidos', ref => ref.orderBy('fecha', 'desc'))

  }

  getPartidos() {
    return this.afs.collection(`partidos`, ref => ref.orderBy('fecha', 'desc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getPartidosByCategoria(categoria:number) {
    return this.afs.collection(`partidos`, ref => ref.orderBy('hora', 'asc').orderBy('cancha', 'asc').where('categoria', '==', categoria)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  agregarPartido(partido:any){
    console.log(partido)
    return this.col.add(partido);
  }

  get(id) {
    return this.afs.doc<any>(`partidos/${id}`);
  }
  
  actualizar(id, data) {
    return this.get(id).update(data)
  }

  eliminar(id) {
    return this.get(id).delete()
  }

}
