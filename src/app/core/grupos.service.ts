import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import { Query } from '@firebase/firestore-types'
import { AuthService } from './auth.service';
import { ArchivoSeis } from './../interfaces/archivo-seis';

@Injectable()
export class GruposService {

  col: AngularFirestoreCollection<any>;

  colFiltrable: Observable<any[]>;
  filtroCat$: BehaviorSubject<string | null>;
  filtroVecindario$: BehaviorSubject<string | null>;

  private carpeta: string = 'fotos_grupos';
  progreso: any;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.col = this.afs.collection('grupos', ref => ref.orderBy('nombre', 'asc').limit(5))
    this.filtroCat$ = new BehaviorSubject(null);
    this.filtroVecindario$ = new BehaviorSubject(null);

  }

  getGrupos(vecindarioId:string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('grupos', ref => ref.orderBy('nombre', 'asc').where('vecindarioId','==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  get(id) {
    return this.afs.doc<any>(`grupos/${id}`);
  }

  actualizar(id, data) {
    return this.get(id).update(data)
  }

  getGruposFiltrable() {
    return this.colFiltrable = Observable.combineLatest(
      this.filtroCat$,this.filtroVecindario$
    ).switchMap(([categoria,vecindario]) =>
      this.afs.collection('grupos', ref => {
        let query: Query = ref;
        query = query.orderBy('nombre', 'asc');
        if (categoria) { query = query.where('categoria', '==', categoria) };
        if (vecindario) { query = query.where('vecindarioId', '==', vecindario) };
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

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }


  agregar(data: any) {
    return this.col.add(data);
  }

  eliminar(id) {
    return this.get(id).delete()
  }

  crearVacio(user: any) {
    const evento = {
 
      creado: this.timestamp,
      fotos: [],
      texto: " ",
      integrantes: [],
      comentarios: [],
      enlinea: this.timestamp,
      userId: user.uid,
      userRef: this.authService.getUserPub(user.uid).ref,

    }
    
    
    return this.col.add(evento);
  }

  cargar(archivo: ArchivoSeis, arreglo: Array<any>) {
    var fecha = new Date().getTime();
    const refStorage = firebase.storage().ref();

    // Client-side validation example
    if (archivo.file.type.split('/')[0] !== 'image') {
      console.error('El archivo que intestaste subir no es una imagen.');
      return;
    }

    const cargar =
      refStorage.child(`${this.carpeta}/${fecha}_${archivo.file.name}`).put(archivo.file);
    cargar.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // upload in progress
        this.progreso = (cargar.snapshot.bytesTransferred / cargar.snapshot.totalBytes) * 100
        console.log(this.progreso);
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        if (arreglo.length == 0) {
          this.actualizar(archivo.grupoId,
            {
              principal: cargar.snapshot.downloadURL
            })
        }
        archivo.url = cargar.snapshot.downloadURL
        archivo.name = archivo.file.name
        archivo.path = `${this.carpeta}/${fecha}_${archivo.file.name}`;
        archivo.creado = fecha;
        return this.guardar(archivo, arreglo);
      }
    );
  }


  private guardar(archivo: ArchivoSeis, arreglo: Array<any>) {
    arreglo.push({
      photoURL: archivo.url,
      path: archivo.path
    });

    this.actualizar(archivo.grupoId,
      { fotos: arreglo }
    );

    return
  }

  getPorId(id) {
    return this.afs.doc<any>(`grupos/${id}`).valueChanges();
  }

  crearId() {
    return this.afs.createId();
  }

  getGruposPorVecindario(vecindarioId: string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('grupos', ref => ref.where('vecindarioId', '==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

}


