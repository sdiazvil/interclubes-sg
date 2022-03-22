import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ArchivoTres } from './../interfaces/archivo-tres';
import { ArchivoCinco } from './../interfaces/archivo-cinco';

@Injectable()
export class EventosService {

  col: AngularFirestoreCollection<any>;
  doc: AngularFirestoreDocument<any>

  private carpeta: string = 'fotos_eventos';
  private carpetaArch: string = 'archivos_eventos';
  fecha: any;
  progreso: any;

  constructor(private afs: AngularFirestore) {
    this.col = this.afs.collection('eventos', ref => ref.orderBy('fecha', 'asc').limit(5))
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

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  getEventosOcultos(vecindarioId:string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('eventos', ref => ref.orderBy('fecha', 'desc').where('oculto','==', true).where('vecindarioId','==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getEventosVisibles(vecindarioId:string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('eventos', ref => ref.orderBy('fecha', 'desc').where('oculto','==', false).where('vecindarioId','==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getEventosFecha() {
    // ['added', 'modified', 'removed']
    return this.afs.collection('eventos', ref => ref.orderBy('fecha', 'asc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getEventosFechaLimit() {
    // ['added', 'modified', 'removed']
    return this.afs.collection('eventos', ref => ref.orderBy('fecha', 'asc').where('oculto','==',false).limit(3)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  get(id) {
    return this.afs.doc<any>(`eventos/${id}`);
  }

  agregar(data: any) {
    return this.col.add(data);
  }

  getPorId(id) {
    return this.afs.doc<any>(`eventos/${id}`).valueChanges();
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

    }
    return this.col.add(evento);
  }

  getFotos(eventoId: string) {
    return this.afs.collection(`fotos_eventos`, ref => ref.orderBy('creado', 'desc').where('eventoId', '==', eventoId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getFoto(id) {
    return this.afs.doc<any>(`fotos_eventos/${id}`);
  }

  actualizarFoto(id, data) {
    return this.getFoto(id).update(data)
  }

  eliminarFoto(id) {
    return this.getFoto(id).delete()
  }


  cargar(archivo: ArchivoTres, arreglo: Array<any>) {
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
        if(arreglo.length==0){
          this.actualizar(archivo.eventoId,
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


  private guardar(archivo: ArchivoTres, arreglo: Array<any>) {
    arreglo.push({
      photoURL: archivo.url,
      path: archivo.path
    });

    this.actualizar(archivo.eventoId,
      { fotos: arreglo }
    );
    
    return
  }

  cargarArchivo(archivo: ArchivoCinco, arreglo: Array<any>, eventoId: string) {
    var fecha = new Date().getTime();
    const refStorage = firebase.storage().ref();

    const cargar =
      refStorage.child(`${this.carpetaArch}/${fecha}_${archivo.file.name}`).put(archivo.file);
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
        archivo.url = cargar.snapshot.downloadURL
        archivo.name = archivo.file.name
        archivo.path = `${this.carpetaArch}/${fecha}_${archivo.file.name}`;
        archivo.creado = fecha;
        return this.guardarArchivo(archivo, arreglo, eventoId);
      }
    );
  }


  private guardarArchivo(archivo: ArchivoCinco, arreglo: Array<any>, eventoId: string) {
    arreglo.push({
      url: archivo.url,
      path: archivo.path,
      nombre: archivo.name,
      creado: archivo.creado,
    });

    this.actualizar(eventoId,
      { archivos: arreglo }
    );

    return
  }

  getEventosPorVecindario(vecindarioId: string) {
    // ['added', 'modified', 'removed']
    return this.afs.collection('eventos', ref => ref.where('vecindarioId', '==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }




}
