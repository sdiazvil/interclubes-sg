import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ArchivoCuatro } from './../interfaces/archivo-cuatro';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import { Query } from '@firebase/firestore-types'
import { AuthService } from './auth.service';

@Injectable()
export class NoticiasService {

  col: AngularFirestoreCollection<any>;
  doc: AngularFirestoreDocument<any>

  private carpeta: string = 'fotos_noticias';
  progreso: any;

  colFiltrable: Observable<any[]>;
  filtroCat$: BehaviorSubject<string | null>;
  filtroVecindario$: BehaviorSubject<string | null>;
  // limit$: BehaviorSubject<number | null>;

  mostrarFormulario = false;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.col = this.afs.collection('noticias', ref => ref.orderBy('fecha', 'asc').limit(5))
    // this.noteDocument = this.afs.doc('notes/mtp1Ll6caN4dVrhg8fWD');
    this.filtroCat$ = new BehaviorSubject(null);
    this.filtroVecindario$ = new BehaviorSubject(null);
    // this.limit$ = new BehaviorSubject(null);
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
      this.filtroCat$,this.filtroVecindario$
    ).switchMap(([categoria,vecindario]) =>
      this.afs.collection('noticias', ref => {
        let query: Query = ref;
        query = query.orderBy('creado', 'desc');
        // query = query.where('vecindarioId','==', vecindarioId);
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
  // getNoticiasFiltrable(){
  //   return this.colFiltrable = Observable.combineLatest(
  //     this.filtroCat$, this.limit$
  //     ).switchMap(([categoria, limit]) =>
  //     this.afs.collection('noticias', ref => {
  //       let query: Query = ref;
  //       query = query.orderBy('creado', 'desc');
  //       if (categoria) { query = query.where('categoria','==', categoria) };
  //       if (limit) { query = query.limit(limit)};
  //       return query;
  //     }).snapshotChanges().map(actions => {
  //       return actions.map(a => {
  //         const data = a.payload.doc.data() as any;
  //         const id = a.payload.doc.id;
  //         return { id, ...data };
  //       });
  //     })
  //     );
  // }

  getNoticiasFecha() {
    // ['added', 'modified', 'removed']
    return this.afs.collection('noticias', ref => ref.orderBy('creado', 'desc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getNoticiasFechaLimit() {
    // ['added', 'modified', 'removed']
    return this.afs.collection('noticias', ref => ref.orderBy('fecha', 'asc').where('oculto', '==', false).limit(3)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  get(id) {
    return this.afs.doc<any>(`noticias/${id}`);
  }

  agregar(data: any) {
    return this.col.add(data);
  }

  getPorId(id) {
    return this.afs.doc<any>(`noticias/${id}`).valueChanges();
  }

  getPorIdSnap(id) {
    return this.afs.collection(`noticias/${id}`).snapshotChanges().map(actions => {
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

  crearVacio(user: any) {
    const evento = {
 
      creado: this.timestamp,
      fotos: [],
      texto: " ",
      megusta: [],
      comentarios: [],
      userId: user.uid,
      categoria:"General",
      userRef: this.authService.getUserPub(user.uid).ref,
      vecindarioId: this.authService.vecindarioId
    }
    return this.col.add(evento);
  }

  getFotos(noticiaId: string) {
    return this.afs.collection(`fotos_noticias`, ref => ref.orderBy('creado', 'desc').where('noticiaId', '==', noticiaId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getFoto(id) {
    return this.afs.doc<any>(`fotos_noticias/${id}`);
  }

  actualizarFoto(id, data) {
    return this.getFoto(id).update(data)
  }

  eliminarFoto(id) {
    return this.getFoto(id).delete()
  }

  cargar(archivo: ArchivoCuatro, arreglo: Array<any>) {
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
        // console.log(this.progreso);
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        if (arreglo.length == 0) {
          this.actualizar(archivo.noticiaId,
            {
              principal: cargar.snapshot.downloadURL
            })
        }
        archivo.url = cargar.snapshot.downloadURL
        archivo.name = archivo.file.name
        archivo.path = `${this.carpeta}/${fecha}_${archivo.file.name}`;
        archivo.creado = fecha;
        // this.progreso = null;
        return this.guardar(archivo, arreglo);
      }
    );
  }


  private guardar(archivo: ArchivoCuatro, arreglo: Array<any>) {
    arreglo.push({
      photoURL: archivo.url,
      path: archivo.path
    });

    this.actualizar(archivo.noticiaId,
      { fotos: arreglo }
    );

    return
  }

  // getUser(id) {
  //   return this.afs.doc<any>(`noticias/${id}`).valueChanges();
  // }

  crearId() {
    return this.afs.createId();
  }

  crearVideo(user: any) {
    const publicacion = {
      creado: this.timestamp,
      fotos: [],
      videos:[],
      texto: " ",
      megusta: [],
      comentarios: [],
      userId: user.uid,
      categoria:"General",
      userRef: this.authService.getUserPub(user.uid).ref,
      vecindarioId: this.authService.vecindarioId
    }
    return this.col.add(publicacion);
  }

  subirVideo(archivo: ArchivoCuatro, arreglo: Array<any>) {
    var fecha = new Date().getTime();
    const refStorage = firebase.storage().ref();

    // Client-side validation example
    if (archivo.file.type.split('/')[0] !== 'video') {
      console.error('El archivo que intestaste subir no es un video.');
      return;
    }

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
        // this.progreso = null;
        return this.guardarVideo(archivo, arreglo);
      }
    );
  }

  private guardarVideo(archivo: ArchivoCuatro, arreglo: Array<any>) {
    arreglo.push({
      videoURL: archivo.url,
      path: archivo.path
    });

    this.actualizar(archivo.noticiaId,
      { videos: arreglo }
    );

    return
  }

  getNoticiasPorVecindario(vecindarioId: string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('noticias', ref => ref.where('vecindarioId', '==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }


}
