import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ArchivoCinco} from './../interfaces/archivo-cinco';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import { Query } from '@firebase/firestore-types'

@Injectable()
export class RepositorioService {

  col: AngularFirestoreCollection<any>;
  doc: AngularFirestoreDocument<any>

  private carpeta: string = 'archivos_repositorio';
  progreso: any; ç

  colFiltrable: Observable<any[]>;
  filtroCat$: BehaviorSubject<string | null>;


  constructor(private afs: AngularFirestore) {
    this.col = this.afs.collection('carpetas', ref => ref.orderBy('fecha', 'asc').limit(5))
    // this.noteDocument = this.afs.doc('notes/mtp1Ll6caN4dVrhg8fWD');
    this.filtroCat$ = new BehaviorSubject(null);
  }

  crearId() {
    return this.afs.createId();
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

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }


  getNoticiasFiltrable() {
    return this.colFiltrable = Observable.combineLatest(
      this.filtroCat$,
    ).switchMap(([categoria]) =>
      this.afs.collection('carpetas', ref => {
        let query: Query = ref;
        query = query.orderBy('creado', 'desc');
        if (categoria) { query = query.where('categoria', '==', categoria) };
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

  getCarpetasOcultas(vecindarioId:string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('carpetas', ref => ref.orderBy('creado', 'desc').where('oculto','==', true).where('vecindarioId','==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getCarpetasVisibles(vecindarioId:string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('carpetas', ref => ref.orderBy('nombre', 'asc').where('oculto','==', false).where('vecindarioId','==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getCarpetasFecha() {
    // ['added', 'modified', 'removed']
    return this.afs.collection('carpetas', ref => ref.orderBy('creado', 'desc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getNoticiasFechaLimit() {
    // ['added', 'modified', 'removed']
    return this.afs.collection('carpetas', ref => ref.orderBy('fecha', 'asc').where('oculto', '==', false).limit(3)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  get(id) {
    return this.afs.doc<any>(`carpetas/${id}`);
  }

  agregar(data: any) {
    return this.col.add(data);
  }

  getPorId(id) {
    return this.afs.doc<any>(`carpetas/${id}`).valueChanges();
  }

  getPorIdSnap(id) {
    return this.afs.collection(`carpetas/${id}`).snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as any;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  actualizar(id, data) {
    return this.get(id).update(data)
  }

  eliminar(id) {
    return this.get(id).delete()
  }

  crearVacio() {
    const evento = {

      creado: this.timestamp,
      fotos: [],
      texto: " ",
      megusta: [],
      comentarios: [],

    }
    return this.col.add(evento);
  }

  cargar(archivo: ArchivoCinco, arreglo: Array<any>, carpetaId: string) {
    var fecha = new Date().getTime();
    const refStorage = firebase.storage().ref();

    const cargar =
      refStorage.child(`${this.carpeta}/${fecha}_${archivo.file.name}`).put(archivo.file);
    cargar.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // upload in progress
        this.progreso = (cargar.snapshot.bytesTransferred / cargar.snapshot.totalBytes) * 100
        // console.log(this.progreso);
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        archivo.url = cargar.snapshot.downloadURL
        archivo.name = archivo.file.name
        archivo.path = `${this.carpeta}/${fecha}_${archivo.file.name}`;
        archivo.creado = fecha;
        this.progreso=null;
        return this.guardar(archivo, arreglo, carpetaId);
      }
    );
  }


  private guardar(archivo: ArchivoCinco, arreglo: Array<any>, carpetaId: string) {
    arreglo.push({
      url: archivo.url,
      path: archivo.path,
      nombre: archivo.name,
      creado: archivo.creado,
    });

    this.actualizar(carpetaId,
      { archivos: arreglo }
    );

    return
  }

  // getUser(id) {
  //   return this.afs.doc<any>(`noticias/${id}`).valueChanges();
  // }

  
  getCarpetasPorVecindario(vecindarioId: string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('carpetas', ref => ref.where('vecindarioId', '==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }


}
