import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService} from './auth.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

// @Injectable()
// export class AuthGuard implements CanActivate {

//   constructor(private authService: AuthService) {}

//   canActivate() {
//     return this.authService.isAuthenticated();
//   }
// }

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) { }
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | boolean {
//       return this.auth.user
//            .take(1)
//            .map(user => !!user)
//            .do(loggedIn => {
//              if (!loggedIn) {
//                console.log('accesso denegado')
//                this.router.navigate(['/iniciosesion']);
//              }
//          })
//   }

// }

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}


//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | boolean {

//       return this.auth.user
//            .take(1)
//            .map(user => !!(user))
//            .do(loggedIn => {
//              if (!loggedIn) {
//                this.router.navigate(['/iniciosesion']);
//              }
//          })

//   }
// }


// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}


//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | boolean {

//       return this.auth.user
//            .take(1)
//            .map(user => !!(user) )
//            .do(loggedIn => {
//              if (!loggedIn) {
//                 console.log('accesso denegado')
//                this.router.navigate(['/iniciosesion']);
//              }
//          })

//   }
// }

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}


//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | boolean {

//       return this.auth.user
//            .map(user => !!(user && user.perfilCompleto) )
//            .do(loggedIn => {
//              if (!loggedIn) {
//                 console.log('accesso denegado')
//                this.router.navigate(['/iniciosesion']);
//              }
//              if (loggedIn) {
//                 console.log('accesso permitido, completa tu perfil')
//                this.router.navigate(['/perfil']);
//              }
//          })

//   }
// }


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

      return this.auth.user
           .map(user => !!(user))
           .do(loggedIn => {
             if (!loggedIn) {
                console.log('accesso denegado')
               this.router.navigate(['/iniciosesion']);
             }
         })

  }
}



