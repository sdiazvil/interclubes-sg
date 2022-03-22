import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Comentario } from '../interfaces/comentario';
import { User } from '../interfaces/user';
import * as firebase from 'firebase';

@Injectable()
export class ComentariosService {

  comentarios: AngularFirestoreCollection<any>;
  comentario: AngularFirestoreDocument<any>

  constructor(private afs: AngularFirestore) {
    this.comentarios = this.afs.collection('comentarios', ref => ref.orderBy('creado', 'desc').limit(5))
    // this.noteDocument = this.afs.doc('notes/mtp1Ll6caN4dVrhg8fWD');
  }

  // getData(): Observable<Foto[]> {
  //   return this.fotosauxCol.valueChanges();
  // }

  // getSnapshot() {
  //   // ['added', 'modified', 'removed']
  //   return this.fotosauxCol.snapshotChanges().map(actions => {
  //     return actions.map(a => {
  //       return { id: a.payload.doc.id, ...a.payload.doc.data() }
  //     })
  //   })
  // }

    getComentarios(publicacionId: string) {
    // return this.afs.collection(`comentarios`, ref => ref.orderBy("creado", "asc").where('publicacionId', '==', publicacionId)).snapshotChanges().map(actions => {
    //   return actions.map(a => {
    //     return { id: a.payload.doc.id, ...a.payload.doc.data() }
    //   })
    // })
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
      // fecha: new Date().getTime(),
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
      // fecha: new Date().getTime(),
      creado: firebase.firestore.FieldValue.serverTimestamp(),
      texto: texto,
      megusta: 0,
      posteadoPor: user,
      publicacionId: publicacionId
    }
    return this.afs.collection(`/publicaciones/${id}/comentarios`).add(comentario);
  }

  // getMySnapshot(id: string) {
  //   // ['added', 'modified', 'removed']
  //   return this.afs.collection('fotosaux', ref => ref.orderBy("creado", "desc").where('publicadopor', '==', id)).snapshotChanges().map(actions => {
  //     return actions.map(a => {
  //       return { id: a.payload.doc.id, ...a.payload.doc.data() }
  //     })
  //   })
  // }

  // getFoto(id) {
  //   return this.afs.doc<Foto>(`fotosaux/${id}`);
  // }

  // crearFoto(path: any, tamanio: string, url: any, fechacreac: any, idpublicacion:any) {
  //   const foto: Foto = {
  //     path: path,
  //     size: tamanio,
  //     url: url,
  //     // url: this.task.downloadURL(),
  //     creado: fechacreac,
  //     // publicadopor: publicadopor,
  //     publicacionId: idpublicacion,
  //   }
  //   this.publicacionService.actualizarPublicacion(idpublicacion, {fotos: true});
  //   return this.fotosauxCol.add(foto);
  // }

  // actualizarFoto(id, data) {
  //   return this.getFoto(id).update(data)
  // }

  // eliminarFoto(id) {
  //   return this.getFoto(id).delete()
  // }

}
