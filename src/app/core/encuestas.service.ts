import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ArchivoTres } from './../interfaces/archivo-tres';
@Injectable()
export class EncuestasService {
  col: AngularFirestoreCollection<any>;
  doc: AngularFirestoreDocument<any>
  private carpeta: string = 'fotos_eventos';
  fecha: any;
  progreso: any;
  constructor(private afs: AngularFirestore) {
    this.col = this.afs.collection('encuestas', ref => ref.orderBy('fecha', 'asc').limit(5))
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
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }
  getEncuestasOc() {
    return this.afs.collection('encuestas', ref => ref.orderBy('fecha', 'asc').where('oculto','==', false)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getEncuestasOcultas(vecindarioId:string) {
    return this.afs.collection('encuestas', ref => ref.orderBy('fecha', 'desc').where('oculto','==', true).where('vecindarioId','==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getEncuestasVisibles(vecindarioId:string) {
    return this.afs.collection('encuestas', ref => ref.orderBy('fecha', 'desc').where('oculto','==', false).where('vecindarioId','==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getEncuestas() {
    return this.afs.collection('encuestas', ref => ref.orderBy('fecha', 'asc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  get(id) {
    return this.afs.doc<any>(`encuestas/${id}`);
  }
  agregar(data: any) {
    return this.col.add(data);
  }
  getPorId(id) {
    return this.afs.doc<any>(`encuestas/${id}`).valueChanges();
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
  cargar(archivo: ArchivoTres) {
    this.fecha = new Date().getTime();
    const refStorage = firebase.storage().ref();
    if (archivo.file.type.split('/')[0] !== 'image') {
      console.error('El archivo que intestaste subir no es una imagen.');
      return;
    }
    const cargar =
      refStorage.child(`${this.carpeta}/${this.fecha}_${archivo.file.name}`).put(archivo.file);
    cargar.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        this.progreso = (cargar.snapshot.bytesTransferred / cargar.snapshot.totalBytes) * 100
      },
      (error) => {
      },
      () => {
        archivo.url = cargar.snapshot.downloadURL
        archivo.name = archivo.file.name
        archivo.path = `${this.carpeta}/${this.fecha}_${archivo.file.name}`;
        archivo.creado = this.fecha;
       return this.guardar(archivo);
      }
    );
  }
  private guardar(archivo: ArchivoTres) {
    var data = JSON.parse(JSON.stringify(archivo));
    this.afs.collection(`fotos_eventos`).add(data); 
    this.actualizar(archivo.eventoId,
    {
      photoURL: data.url
    });
    return
  }
  getEncuestasPorVecindario(vecindarioId: string) {
    return this.afs.collection('encuestas', ref => ref.where('vecindarioId', '==', vecindarioId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
}
