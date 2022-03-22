import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { Comentario } from '../interfaces/comentario';
import { User } from '../interfaces/user';
@Injectable()
export class ComentariosService {
  comentarios: AngularFirestoreCollection<any>;
  comentario: AngularFirestoreDocument<any>
  constructor(private afs: AngularFirestore) {
    this.comentarios = this.afs.collection('comentarios', ref => ref.orderBy('creado', 'desc').limit(5))
  }
    getComentarios(publicacionId: string) {
    return this.afs.collection(`comentarios`, ref => ref.where('publicacionId', '==', publicacionId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }
  getComments(numero: any, publicacionId: string){
    return this.afs.collection(`comentarios`, ref => ref.orderBy('creado', 'asc').limit(numero).where('publicacionId', '==', publicacionId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })  }
    getComnum(){
    return this.afs.collection(`comentarios`, ref => ref.orderBy('creado', 'asc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })  
  }
    getComentarioSub(id:string){
    return this.afs.collection(`/publicaciones/${id}/comentarios`, ref => ref.orderBy('creado', 'asc').limit(5)).valueChanges();
   }
  agregarComentario(user: User, publicacionId: any, texto: any) {
    const comentario: Comentario = {
      creado: firebase.firestore.FieldValue.serverTimestamp(),
      texto: texto,
      megusta: 0,
      posteadoPor: user,
      publicacionId: publicacionId
    }
    return this.comentarios.add(comentario);
  }
  agregarComentarioSub(user: User, publicacionId: any, texto: any, id:string) {
    const comentario: Comentario = {
      creado: firebase.firestore.FieldValue.serverTimestamp(),
      texto: texto,
      megusta: 0,
      posteadoPor: user,
      publicacionId: publicacionId
    }
    return this.afs.collection(`/publicaciones/${id}/comentarios`).add(comentario);
  }
}
