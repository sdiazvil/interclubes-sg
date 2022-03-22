import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/auth.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { MatSnackBar } from '@angular/material';
import { VecindariosComponent } from '../vecindarios/vecindarios.component';

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
  // user: any;

  constructor(public snackBar: MatSnackBar, public authService: AuthService, public activeModal: NgbActiveModal, public vs: VecindariosService) {
  }

  ngOnInit() {
    // this.authService.user.subscribe(user => this.user = user);

  }

  cerrarModal() {
    this.activeModal.close();
  }

  // toggleVecino(userId: any, variable, cont:number){
  //   if(variable){
  //     this.es.actualizar(userId,
  //       {
  //         equipo: false,
  //         posicion: null
  //       }
  //     );
  //     this.es.actualizarCont({
  //       contEquipo: cont - 1
  //     })
  //   }else{
  //     this.es.actualizar(userId,
  //       {
  //         equipo: true,
  //         posicion: cont
  //       }
  //     );
  //     this.es.actualizarCont({
  //       contEquipo: cont + 1
  //     })
  //   }
  // }

  // toggleAdmin(userId: any, variable) {
  //   if(variable){
  //     this.es.actualizar(userId,
  //       {
  //         admin: false,
  //       }
  //     );
  //   }else{
  //     this.es.actualizar(userId,
  //       {
  //         admin: true,
  //       }
  //     );
  //   }
  // }


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
            // console.log(vecindariosArreglo);
            this.authService.updateUsuario(vecino.userId, {
              vecindarios: vecindariosArreglo
            });
          }, 1000);
        }
      },
      error => console.log("onError", error)
    );



  }

  //  agregarUsuario(arreglo: Array<any>, userId:string){
  //   arreglo.push({
  //     nombre: this.vecindarioNombre,
  //     vecindarioId: this.vecindarioId
  //   })
  //   this.authService.updateUsuario(userId, {
  //     vecindarios: arreglo
  //   });

  // }


  // eliminarVecinoPendientes(){
  //   var arreglo = this.listado
  //   arreglo = arreglo.filter(item => item.userId !== userId)

  //   this.gs.actualizar(id,
  //     { integrantes: arreglo }
  //   );

  //   this.snackBar.open('Has salido del grupo', 'CERRAR', {
  //     duration: 4000
  //   });

  // }

  eliminarVecino(vecino: any) {

    // var arregloVecinos = this.vecinos;
    // var arregloAdmins = this.admin;
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

    // vecindariosArreglo = vecindariosArreglo.filter(item => item.vecindarioId !== this.vecindarioId)
    // this.authService.updateUsuario(vecino.userId, {
    //   vecindarios: vecindariosArreglo
    // })

    this.authService.getUsuario(vecino.userId).subscribe(
      user => {
        vecindariosArreglo = user.vecindarios;
        vecindariosArreglo = vecindariosArreglo.filter(item => item.vecindarioId !== this.vecindarioId);
        if (user.actual == this.vecindarioId) {
          actual = true;
        }
      },
      error => console.log("onError", error)
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
    // console.log(vecino)
    var arreglo: Array<any> = this.admin;
    // var arregloPendientes:  Array<any> = this.pendientes
    // console.log(arreglo)
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

  // agregarAdmin(id: string, arreglo: Array<any>, userId: string) {
  //   // console.log(arreglo)
  //   arreglo.push({
  //     userId: userId,
  //     // numero: 3
  //   });

  //   this.gs.actualizar(id,
  //     { integrantes: arreglo }
  //   );

  // }

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
