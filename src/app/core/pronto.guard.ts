import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ProntoGuard implements CanActivate {
  constructor(public snackBar: MatSnackBar, private auth: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.user
      // .map(user => !!(user && user.vecindarios.length==0))
      .map(user => !(user.vecindarios.length==0))
      .do(loggedIn => {
        if (!loggedIn) {
          // this.snackBar.open('accesso denegado.', 'CERRAR', {
          //   duration: 4000
          // });
          // console.log('Accesso denegado')
          this.router.navigate(['/pronto']);
        }
      })
  }
}
