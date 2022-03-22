import { Injectable } from '@angular/core';
import { Query } from '@firebase/firestore-types';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class EquipoService {
  filtroNombreInicio$: BehaviorSubject<string | null>;
  filtroNombreFin$: BehaviorSubject<string | null>;
  colSearch: Observable<any[]>;
  col: AngularFirestoreCollection<any>;
  doc: AngularFirestoreDocument<any>
  cfg: AngularFirestoreDocument<any>
  constructor(private afs: AngularFirestore) {
    this.col = this.afs.collection('users', ref => ref.orderBy('fecha', 'desc').limit(5));
    this.cfg = this.afs.doc('config/YWzS9PKr9hgopZQEPKWW');
    this.filtroNombreInicio$ = new BehaviorSubject(null);
    this.filtroNombreFin$ = new BehaviorSubject(null);
  }
  getUsers(){
    return this.colSearch = Observable.combineLatest(
      this.filtroNombreInicio$,
      this.filtroNombreFin$,).switchMap(([nombreinicio, nombrefin]) =>
      this.afs.collection('users', ref => {
        let query: Query = ref;
        if (nombreinicio && nombrefin) { query = query.orderBy('displayName').startAt(nombreinicio).endAt(nombrefin) };
        return query;
      }).snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
      );
  }
  getEquipo() {
    return this.afs.collection('users', ref => ref.orderBy('posicion', 'asc').where('equipo','==', true)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getCfg(){
   return this.cfg.valueChanges();
  }
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }
  actualizarCont(data){
    return this.cfg.update(data);
  }
  filtroNombre(texto) {
    const textoBuscar = texto;
    this.filtroNombreInicio$.next(textoBuscar);
    this.filtroNombreFin$.next(textoBuscar + '\uf8ff');
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
  get(id) {
    return this.afs.doc<any>(`users/${id}`);
  }
  agregar(user: any){
    return this.col.add(user);
  }
  actualizar(id, data) {
    return this.get(id).update(data)
  }
  eliminar(id) {
    return this.get(id).delete()
  }
}
