import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NotificacionesService {

  private notificacion = firebase.messaging()

  private notificacionBase = new Subject()
  notificacionActual = this.notificacionBase.asObservable()

  constructor(private afs: AngularFirestore) {
  }

   // get permission to send messages
   permisoNotificaciones(user) {
    this.notificacion.requestPermission()
    .then(() => {
      console.log('Permisos de Notificación Entregados.');
      return this.notificacion.getToken()
    })
    .then(token => {
      console.log(token)
      this.guardarToken(user, token)
    })
    .catch((err) => {
      console.log('No es posible entregar permisos de notificación.', err);
    });
  }

  monitorRefrescarToken(user) {
    this.notificacion.onTokenRefresh(() => {
      this.notificacion.getToken()
      .then(refreshedToken => {
        console.log('Token refrescado.');
        this.guardarToken(user, refreshedToken)
      })
      .catch( err => console.log(err, 'No se puede entregar un nuevo token') )
    });
  }

  recibirNotificaciones() {
    this.notificacion.onMessage(payload => {
     console.log('Notificiación recibida. ', payload);
     this.notificacionBase.next(payload)
   });

  }

  // save the permission token in firestore
  private guardarToken(user, token): void {
    
      const currentTokens = user.fcmTokens || { }
      console.log(currentTokens, token)

      // If token does not exist in firestore, update db
      if (!currentTokens[token]) {
        const userRef = this.afs.collection('users').doc(user.uid)
        const tokens = { ...currentTokens, [token]: true }
        userRef.update({ fcmTokens: tokens })
      }
  }

}
