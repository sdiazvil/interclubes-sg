import { Injectable } from '@angular/core';
import { Query } from '@firebase/firestore-types';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ArchivoOcho } from '../interfaces/archivo-ocho';
@Injectable()
export class PartidosService {
  col: AngularFirestoreCollection<any>;
  // doc: AngularFirestoreDocument<any>
  // colFiltrable: Observable<any[]>;
  // filtroComuna$: BehaviorSubject<string | null>;
  // filtroRegion$: BehaviorSubject<string | null>;
  // vecindariosCollection: any;
  // vecindariosArreglo: any;
  // vecindarios: any;
  // private carpeta: string = 'banners';
  // progreso: any;
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
    return this.afs.collection(`partidos`, ref => ref.orderBy('cancha', 'asc').where('categoria', '==', categoria)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  agregarPartido(partido:any){
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
