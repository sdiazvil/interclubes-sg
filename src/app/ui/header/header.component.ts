import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../core/auth.service';
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
  onLogout() {
    this.authService.salir();
    this.router.navigate(['/inicio'])
  }
  salir() {
    this.snackBar.open('Has cerrado sesión correctamente, vuelve pronto. ', 'CERRAR', {
      duration: 4000
    });
    this.authService.salir();
  }
  toggle(){
    this.ac.sidenav.toggle();
  }
}
