import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FotosService {

  // UPLOAD MULTI
  private carpeta: string = '/fotosaux';

  fotosauxCol: AngularFirestoreCollection<any>;
  fotosDoc: AngularFirestoreDocument<any>

  constructor(private afs: AngularFirestore) {
    this.fotosauxCol = this.afs.collection('fotosaux', ref => ref.orderBy('fecha', 'desc').limit(5))
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

    getFotos(publicacionId: string) {
    return this.afs.collection(`fotosaux`, ref => ref.orderBy('creado', 'desc').where('publicacionId', '==', publicacionId)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
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
