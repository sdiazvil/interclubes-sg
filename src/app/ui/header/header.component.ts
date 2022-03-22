import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  selected = 'Brisas del Norte';


  constructor(public ac: AppComponent,private modalService: NgbModal, public snackBar: MatSnackBar, public authService: AuthService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit() {
  }

  // isAuth() {
  //   return this.autService.isAuthenticated();
  // }

  onLogout() {
    this.authService.salir();
    this.router.navigate(['/inicio'])
  }

  salir() {
    this.snackBar.open('Has cerrado sesión correctamente, vuelve pronto. ', 'CERRAR', {
      duration: 4000
    });
    this.authService.salir();
    // this.router.navigate(['/iniciosesion']);
  }

  toggle(){
    this.ac.sidenav.toggle();
  }


}
