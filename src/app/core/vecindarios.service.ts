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
export class VecindariosService {
  col: AngularFirestoreCollection<any>;
  doc: AngularFirestoreDocument<any>
  colFiltrable: Observable<any[]>;
  filtroComuna$: BehaviorSubject<string | null>;
  filtroRegion$: BehaviorSubject<string | null>;
  vecindariosCollection: any;
  vecindariosArreglo: any;
  vecindarios: any;
  private carpeta: string = 'banners';
  progreso: any;
  constructor(private afs: AngularFirestore) {
    this.col = this.afs.collection('vecindarios', ref => ref.orderBy('fecha', 'desc'))
    this.filtroComuna$ = new BehaviorSubject(null);
    this.filtroRegion$ = new BehaviorSubject(null);
    this.vecindariosCollection = this.afs.collection(`vecindarios`, ref => ref.orderBy("nombre", "asc"));
    this.vecindarios = this.vecindariosCollection.snapshotChanges().
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })).subscribe((items: any) => {
        this.vecindariosArreglo = [];
        this.vecindariosArreglo = items;
      });
  }
  getVecindariosFiltrable() {
    return this.colFiltrable = Observable.combineLatest(
      this.filtroComuna$,
      this.filtroRegion$,
    ).switchMap(([comuna, region, 
    ]) =>
      this.afs.collection('vecindarios', ref => {
        let query: Query = ref;
        query = query.orderBy('fecha_creacion', 'desc');
        if (comuna) { query = query.where('comuna', '==', comuna) };
        if (region) { query = query.where('region', '==', region) };
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
  getVecindarios() {
    return this.afs.collection('vecindarios', ref =>  ref.orderBy('nombre', 'asc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getMisVecindarios(userId:string) {
    return this.afs.collection('vecindarios').snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  get(id) {
    return this.afs.doc<any>(`vecindarios/${id}`);
  }
  eliminar(id) {
    return this.get(id).delete()
  }
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }
  agregar(data: any) {
    return this.col.add(data);
  }
  actualizar(id, data) {
    return this.get(id).update(data)
  }
  getVecindario(vecindarioId: string){
    return this.afs.doc(`vecindarios/${vecindarioId}`).valueChanges();
   }
  actualizarVecindario(vecindarioId, data) {
    return this.afs.doc(`vecindarios/${vecindarioId}`).update(data);
  }
  cargar(archivo: ArchivoOcho) {
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
  private guardar(archivo: ArchivoOcho) {
    if(archivo.tipo == 'Movil'){
      this.actualizarVecindario(archivo.vecindarioId,
        {
          banner_movil: archivo.url,
          path_banner_movil: archivo.path
        });
    }
    if(archivo.tipo == 'Web'){
      this.actualizarVecindario(archivo.vecindarioId,
        {
          banner_web: archivo.url,
          path_banner_web: archivo.path
        });
    }
    return
  }
}
