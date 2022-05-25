import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../core/auth.service';
import { NotificacionesService } from '../../core/notificaciones.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selected = 'Brisas del Norte';
  notificaciones: any;
  subs:Subscription;  
  constructor(public ac: AppComponent, private modalService: NgbModal, public snackBar: MatSnackBar, public authService: AuthService,
    private router: Router, public notiService: NotificacionesService,
    private activatedRouter: ActivatedRoute) { }
  ngOnInit() {
    this.subs = this.authService.user.subscribe(user => {
      if(user){
        console.log(user.uid);
        this.notificaciones = this.notiService.getMisNotificaciones(user.uid);
      }
    });
  }
  onLogout() {
    this.subs.unsubscribe();
    this.authService.salir();
    this.router.navigate(['/inicio']);
  }
  salir() {
    this.snackBar.open('Has cerrado sesión correctamente, vuelve pronto. ', 'CERRAR', {
      duration: 4000
    });
    this.authService.salir();
  }
  toggle() {
    this.ac.sidenav.toggle();
  }
  checkDosBarbas(user: any) {

    user.vecindarios.forEach(vecindario => {
      if (vecindario.vecindarioId == 'XlsfFUjwbcuAzeQesPIa') {
        return true;
      } else {
        return false;
      }
    });
  }

  marcarLeida(id: string) {
    this.notiService.actualizar(id, { leido: true });
    this.router.navigate(['/']);
  }

  checkNotificacionesNoleidas(notificaciones: any) {
    let contador = 0;
    notificaciones.forEach(notificacion => {
      if (!notificacion.leido) {
        contador++;
      }
    }
    );
    return contador;
  }
}
