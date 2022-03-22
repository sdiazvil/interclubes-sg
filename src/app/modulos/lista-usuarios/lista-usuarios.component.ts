import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/auth.service';
import { VecindariosService } from '../../core/vecindarios.service';
@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  @Input() public pendientes;
  @Input() public vecinos;
  @Input() public admin;
  @Input() public titulo;
  @Input() public vecindarioId;
  @Input() public vecindarioNombre;
  buscar = '';
  constructor(public snackBar: MatSnackBar, public authService: AuthService, public activeModal: NgbActiveModal, public vs: VecindariosService) {
  }
  ngOnInit() {
  }
  cerrarModal() {
    this.activeModal.close();
  }
  aceptarVecino(vecino: any) {
    var arreglo: Array<any> = this.vecinos;
    var vecindariosArreglo: Array<any>;
    var encontrado = false;
    var found = false;
    for (var i = 0; i < arreglo.length; i++) {
      if (arreglo[i].userId == vecino.userId) {
        found = true;
      }
    }
    if (found) {
    }
    if (!found) {
      arreglo.push({
        userId: vecino.userId,
        userRef: this.authService.getUserPub(vecino.userId).ref,
        displayName: vecino.displayName
      });
      this.vs.actualizar(this.vecindarioId,
        { vecinos: arreglo }
      );
      this.pendientes = this.pendientes.filter(item => item.userId !== vecino.userId)
      this.vs.actualizar(this.vecindarioId,
        { pendientes: this.pendientes }
      );
    }
    this.authService.getUsuario(vecino.userId).subscribe(
      user => {
        vecindariosArreglo = user.vecindarios;
        for (var i = 0; i < vecindariosArreglo.length; i++) {
          if (vecindariosArreglo[i].vecindarioId == this.vecindarioId) {
            encontrado = true;
          }
        }
        if (encontrado) {
        }
        if (!encontrado) {
          vecindariosArreglo.push({
            nombre: this.vecindarioNombre,
            vecindarioId: this.vecindarioId
          });
          setTimeout(() => {
            this.authService.updateUsuario(vecino.userId, {
              vecindarios: vecindariosArreglo
            });
          }, 1000);
        }
      },
      error => console.log(error)
    );
  }
  eliminarVecino(vecino: any) {
    var vecindariosArreglo: Array<any>;
    var actual = false;
    this.vecinos = this.vecinos.filter(item => item.userId !== vecino.userId);
    this.admin = this.admin.filter(item => item.userId !== vecino.userId);
    this.vs.actualizar(this.vecindarioId,
      {
        vecinos: this.vecinos,
        admin: this.admin
      }
    );
    this.authService.getUsuario(vecino.userId).subscribe(
      user => {
        vecindariosArreglo = user.vecindarios;
        vecindariosArreglo = vecindariosArreglo.filter(item => item.vecindarioId !== this.vecindarioId);
        if (user.actual == this.vecindarioId) {
          actual = true;
        }
      },
      error => console.log(error)
    );
    setTimeout(() => {
      if (actual) {
        this.authService.updateUsuario(vecino.userId, {
          actual: null
        });
      }
      this.authService.updateUsuario(vecino.userId, {
        vecindarios: vecindariosArreglo
      });
    }, 1000);
    this.snackBar.open('El vecino ha sido eliminado de la comunidad', 'CERRAR', {
      duration: 4000
    });
  }
  agregarAdmin(vecino: any) {
    var arreglo: Array<any> = this.admin;
    arreglo.push({
      userId: vecino.userId,
      userRef: this.authService.getUserPub(vecino.userId).ref,
      displayName: vecino.displayName
    });
    this.vs.actualizar(this.vecindarioId,
      { admin: arreglo }
    );
    this.snackBar.open('El vecino ha sido agregado como Administrador', 'CERRAR', {
      duration: 4000
    });
  }
  eliminarAdmin(vecino: any) {
    this.admin = this.admin.filter(item => item.userId !== vecino.userId)
    this.vs.actualizar(this.vecindarioId,
      { admin: this.admin }
    );
    this.snackBar.open('El vecino ha sido eliminado de Administradores', 'CERRAR', {
      duration: 4000
    });
  }
  checkVecino(userId: string): boolean {
    var pendientes: Array<any> = this.pendientes;
    return pendientes = pendientes.find(item =>
      item.userId == userId
    )
  }
  checkAdmin(userId: string): boolean {
    var admin: Array<any> = this.admin;
    return admin = admin.find(item =>
      item.userId == userId
    )
  }
  checkAdminBarrio(user: any): boolean {
    var administradores = this.admin;
    return administradores = administradores.find(item =>
      item.userId == user.uid
    )
  }
}
