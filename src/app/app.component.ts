import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Event as RouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import 'rxjs/add/observable/empty';
import { AuthService } from './core/auth.service';
import { NoticiasService } from './core/noticias.service';
import { NotificacionesService } from './core/notificaciones.service';
import { VecindariosService } from './core/vecindarios.service';
import { MENUS } from './interfaces/menus';
const SMALL_WIDTH_BREAKPOINT = 1100;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public loading: boolean = true;
  menus = MENUS;
  @ViewChild('sidenav') sidenav: MatSidenav;
  userId: any = null;
  user: any;
  vecindarios$: any;
  vecindarioActual: any = 0;
  constructor(public notificacionesService: NotificacionesService, private ns: NoticiasService, private vs: VecindariosService, public snackBar: MatSnackBar, private router: Router, public authService: AuthService) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }
  ngOnInit() {
    this.authService.user.subscribe(user => {
      this.user = user
      if (user) {
        if (user.vecindarios.length > 0) {
          if (this.user.actual) {
            this.vecindarioActual = this.user.actual;
          } else {
            this.vecindarioActual = this.user.vecindarios[0].vecindarioId;
          }
          this.authService.vecindarioId = this.vecindarioActual;
          this.notificacionesService.permisoNotificaciones(user);
          this.notificacionesService.monitorRefrescarToken(user);
          this.notificacionesService.recibirNotificaciones();
        }
      } else {
      }
    });
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
    this.vecindarios$ = this.vs.getVecindarios();
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => this.loading = false, 1000);
    }
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }
  salir() {
    this.snackBar.open('Has cerrado sesión correctamente, vuelve pronto.', 'CERRAR', {
      duration: 4000
    });
    this.authService.salir();
    this.router.navigate(['/']);
  }
  cambiarVecindario() {
    this.vecindarioActual = this.vecindarioActual;
    this.authService.updateUsuario(this.user.uid, {
      actual: this.vecindarioActual
    })
    this.ns.filtroVecindario$.next(this.vecindarioActual);
    this.authService.vecindarioId = this.vecindarioActual;
    this.router.navigate(['/plaza'])
  }
}
