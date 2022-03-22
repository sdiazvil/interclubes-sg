import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import * as firebase from 'firebase/app';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User } from '../interfaces//user';
import { VecindariosService } from './vecindarios.service';

@Injectable()
export class AuthService {

  //NORMAL
  user: Observable<User>;

  // users: any;

  usuariosCollection: any;
  usuariosArreglo: any;
  usuarios: any;
  vecindarioId:string;

  constructor(public vs:VecindariosService, public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {

    //NORMAL
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      });
    // this.users = this.afs.collection('users').valueChanges();

    // this.users = this.getUsuarios();

    //Usuarios Material Table Filtrable
    this.usuariosCollection = this.afs.collection(`users`, ref => ref.orderBy("fecha_registro", "asc"));
    this.usuarios = this.usuariosCollection.snapshotChanges().
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })).subscribe((items: any) => {
        this.usuariosArreglo = [];
        this.usuariosArreglo = items;
      });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.agregarUsuario(credential.user);
        this.router.navigate(['/perfil']);
      }).catch(error => console.log(error));
  }

  ingresarEmail(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(datos.email, datos.password)
        .then((user) => {
          // this.actualizarDatosInicio(user);
          resolve(user);
        })
        .catch((err: any) => {
          var message = err.message;
          reject(message);
        });
    });
  }

  // async login(email: string, password: string): Promise<User> {
  //   try {
  //     const { user } = await this.afAuth.auth.signInWithEmailAndPassword(
  //       email,
  //       password
  //     );
  //     // this.updateUserData(user);
  //     return user;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  registroUsuario(datos): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(datos.email,
        datos.password)
        .then((user) => {
          this.agregarUsuario(user);
          this.actualizarUsuario(user,
            {
              displayName: datos.displayName,
              fecha_nac: datos.fecha_nac,
              genero: datos.genero
            });

            // this.vs.getUsuario(datos.).subscribe(
            //   user => {
            //     vecindariosArreglo = user.vecindarios;
            //     vecindariosArreglo.push({
            //       nombre: this.vecindarioNombre,
            //       vecindarioId: this.vecindarioId
            //     })
            //     resolve('');
            //   },
            //   error => {
            //     reject();
            //   }
            // )
            
            // Agregar usuario a la lista de pendientes

            var arreglo = datos.pendientes;
            arreglo.push({
              userId: user.uid,
              displayName: datos.displayName,
              userRef: this.getUserPub(user.uid).ref,
            });
        
            this.vs.actualizar(datos.vecindarioId,
              { pendientes: arreglo }
            );
          resolve(user);
        })
        .catch((err: any) => {
          var message = err.message;
          reject(message);
        });
    });
  }

  reiniciarCont(datos): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(datos.email)
        .then((val: any) => {
          resolve();
        })
        .catch((err: any) => {
          var message = err.message;
          reject(message);
        });
    });
  }

  // Update properties on the user document con Usuario
  actualizarUsuario(user: User, data: any) {
    return this.afs.doc(`users/${user.uid}`).update(data)
  }

  // Update properties on the user document con id
  updateUsuario(uid: string, data: any) {
    return this.afs.doc(`users/${uid}`).update(data)
  }

  private agregarUsuario(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      fecha_registro: firebase.firestore.FieldValue.serverTimestamp(),
      displayName: user.displayName,
      // photoURL: user.photoURL || 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
      photoURL: user.photoURL || null,
      admin: false,
      path: null,
      vecindarios: [],
      actual: null
      // photoURL: 'https://goo.gl/Fz9nrQ'      
    }
    return userRef.set(data)
  }

  salir() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/iniciosesion']);
    });
  }

  getUsuarios() {
    // return this.afs.collection(`users`, ref => ref.orderBy("creado", "desc")).snapshotChanges().map(actions => {
    //   return actions.map(a => {
    //     return { id: a.payload.doc.id, ...a.payload.doc.data() }
    //   })
    // })
    return this.afs.collection(`users`).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  //GET UID
  //   get authenticated(): boolean {
  //       if (this.userDetails == null ) {
  //          return false;
  //       } else {
  //          return true;
  //       }
  //     }

  //   get currentUserId(): string {
  //     return this.authenticated ? this.userDetails.uid : '';
  //  }

  getUserPub(id) {
    return this.afs.doc<any>(`users/${id}`);
  }

  getUsuario(id) {
    return this.afs.doc<any>(`users/${id}`).valueChanges();

  }

  public getUser(documentId: string) {
    return this.afs.collection('users').doc(documentId).snapshotChanges();
  }


}
