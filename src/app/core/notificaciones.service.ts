import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { AuthService } from './auth.service';

@Injectable()
export class NotificacionesService {

  private notificacion = firebase.messaging()

  private notificacionBase = new Subject();
  notificacionesCol: AngularFirestoreCollection<any>;

  notificacionActual = this.notificacionBase.asObservable()

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.notificacionesCol = this.afs.collection('notificaciones', ref => ref.orderBy('fecha', 'desc'));
  }

  // get permission to send messages
  permisoNotificaciones(user) {
    this.notificacion.requestPermission()
      .then(() => {
        // console.log('Permisos de Notificación Entregados.');
        return this.notificacion.getToken()
      })
      .then(token => {
        // console.log(token)
        this.guardarToken(user, token)
      })
      .catch((err) => {
        // console.log('No es posible entregar permisos de notificación.', err);
      });
  }

  monitorRefrescarToken(user) {
    this.notificacion.onTokenRefresh(() => {
      this.notificacion.getToken()
        .then(refreshedToken => {
          // console.log('Token refrescado.');
          this.guardarToken(user, refreshedToken)
        })
        .catch(err => console.log(err, 'No se puede entregar un nuevo token'))
    });
  }

  recibirNotificaciones() {
    this.notificacion.onMessage(payload => {
      // console.log('Notificiación recibida. ', payload);
      this.notificacionBase.next(payload)
    });

  }

  // save the permission token in firestore
  private guardarToken(user, token): void {

    const currentTokens = user.fcmTokens || {}
    // console.log(currentTokens, token)

    // If token does not exist in firestore, update db
    if (!currentTokens[token]) {
      const userRef = this.afs.collection('users').doc(user.uid)
      const tokens = { ...currentTokens, [token]: true }
      userRef.update({ fcmTokens: tokens })
    }
  }

  agregarNotificacion(userId: any) {
    const notificacion: any = {
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
      accion: 'ha publicado en la Plaza de la Comunidad "Dos Barbas"',
      leido: false,
      userId: userId,
      // userRef: this.authService.getUserPub(user.uid).ref,
      vecindarioId: this.authService.vecindarioId
    }
    return this.notificacionesCol.add(notificacion);
  }

  getMisNotificaciones(id: string) {
    // console.log(id);
    return this.afs.collection('notificaciones', ref => ref.orderBy('fecha', 'desc').where('userId', '==', id).limit(7)).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  get(id) {
    return this.afs.doc<any>(`notificaciones/${id}`);
  }

  actualizar(id, data) {
    return this.get(id).update(data)
  }

}
