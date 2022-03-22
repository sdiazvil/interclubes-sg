import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatSnackBar } from '@angular/material';
import { VecindariosService } from '../../core/vecindarios.service';
import { AgregarVecindarioComponent } from '../agregar-vecindario/agregar-vecindario.component';
import { CIUDADES } from '../../interfaces/ciudades'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListaUsuariosComponent } from '../lista-usuarios/lista-usuarios.component';
import { ConfirmarEliminarComponent } from '../confirmar-eliminar/confirmar-eliminar.component';

@Component({
  selector: 'app-vecindarios',
  templateUrl: './vecindarios.component.html',
  styleUrls: ['./vecindarios.component.css']
})
export class VecindariosComponent implements OnInit {

  modalOption: NgbModalOptions = {}; // not null!
  vecindarios$: any;
  usuarios$: any;
  mostrarVisibles = true;
  users: any;
  maximo = 6;

  // eventos = [
  //   {
  //     nombre: 'Evento de Prueba 1',
  //     fecha: new Date('4/28/18'),
  //     descripcion: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.',
  //     lugar: 'Universidad de Antofagasta',

  //   },

  // ];

  ciudades = CIUDADES;
  comunas: any;
  formulario: FormGroup;
  mostrarMas: any = null;
  buscar = '';

  constructor(public fb: FormBuilder, public snackBar: MatSnackBar, private storage: AngularFireStorage, public authService: AuthService, private vs: VecindariosService, private modalService: NgbModal,) {
    this.formulario = this.fb.group({
      'region': [''],
      'comuna': [''],
    });
  }

  ngOnInit() {
    // this.authService.user.subscribe(user => this.user = user);
    this.vecindarios$ = this.vs.getVecindariosFiltrable();
    this.usuarios$ = this.authService.getUsuarios();
    this.getComunas();
    this.authService.getUsuarios().subscribe(usuarios => this.users = usuarios);
  }

  ngOnDestroy() {
    this.limpiar();
  }

  getComunas() {
    this.formulario.get('region').valueChanges.subscribe(value => {
      this.ciudades.forEach(ciudad => {
        if (ciudad.nombre == value) {
          this.comunas = ciudad.comunas;
        }
      });
    });
  }
  
  open() {
    // this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(AgregarVecindarioComponent, this.modalOption);
    // modalRef.componentInstance.id = this.id;
  }

  eliminar(vecindario: any) {
    var vecindariosArreglo: any;
    var actual = false;

    this.users.forEach(user => {
      vecindariosArreglo = user.vecindarios;
      vecindariosArreglo = vecindariosArreglo.filter(item => item.vecindarioId !== vecindario.id)
      if (user.actual == vecindario.id) {
        this.authService.updateUsuario(user.uid, {
          actual: null
        });
      }
      this.authService.updateUsuario(user.uid, {
        vecindarios: vecindariosArreglo
      });
    });

    // for (var i = 0; i < vecindario.vecinos.length; i++) {
    //   this.authService.getUsuario(vecindario.vecinos[i].userId).subscribe(
    //     user => {
    //       vecindariosArreglo = user.vecindarios;
    //       vecindariosArreglo = vecindariosArreglo.filter(item => item.vecindarioId !== vecindario.id)
    //       if (user.actual == vecindario.id) {
    //         actual = true;
    //       }
    //     },
    //     error => console.log("onError", error)
    //   );
    //   setTimeout(() => {
    //     if (actual) {
    //       this.authService.updateUsuario(vecindario.vecinos[i].userId, {
    //         actual: null
    //       });
    //     }
    //     this.authService.updateUsuario(vecindario.vecinos[i].userId, {
    //       vecindarios: vecindariosArreglo
    //     });
    //   }, 1000);
    //   actual = false;
    // }

    this.vs.eliminar(vecindario.id);

    this.snackBar.open('La comunidad ha sido eliminada correctamente.', 'CERRAR', {
      duration: 4000
    });
  }

  cargarMas() {
    this.maximo += 6;
  }


  // filtroCategoria($event) {
  //   if ($event.target.value == '') {
  //     this.titulo = "Todas las Publicaciones";
  //     this.icono = "public"
  //   } else {
  //     this.titulo = "Publicaciones de: " + $event.target.value;
  //     for (var i = 0; i < this.categorias.length; i++) {
  //       if (this.categorias[i].nombre == $event.target.value) {
  //         this.icono = this.categorias[i].icono;
  //       }
  //     }
  //   }
  //   this.filtroCategoria$.next($event.target.value);
  // }

  filtrarComuna(comuna: any) {
    // console.log("Comuna: " + comuna)
    this.vs.filtroComuna$.next(comuna);
    // this.nomCat = categoria;
    // this.nc.maxNoticias = 3;
  }

  // buscar($event) {
  //   const textoBuscar = $event.target.value
  //   this.vs.filtroTituloInicio$.next(textoBuscar);
  //   this.vs.filtroTituloFin$.next(textoBuscar + '\uf8ff');
  // }
  // buscar($event) {
  //   this.vs.filtroNombre($event.target.value);
  // }

  limpiar() {
    this.vs.filtroComuna$.next(null)
    this.vs.filtroRegion$.next(null)
    this.formulario.reset();
    this.buscar = null;
  }

  cambiarRegion(nombre: string) {
    this.vs.filtroRegion$.next(nombre);
    this.vs.filtroComuna$.next(null)
  }
  cambiarComuna(nombre: string) {
    this.vs.filtroComuna$.next(nombre);
  }

  limpiarBuscar() {
    // this.vs.filtroNombre(null);
    this.buscar = null;
  }

  itemTrackBy(index: number, item) {
    return item.id;
  }


  solicitarUnirse(id: string, arreglo: Array<any>, user: any) {
    // console.log(arreglo)
    arreglo.push({
      userId: user.uid,
      displayName: user.displayName,
      userRef: this.authService.getUserPub(user.uid).ref,
      // numero: 3
    });

    this.vs.actualizar(id,
      { pendientes: arreglo }
    );

    this.snackBar.open('Su solicitud ha sido enviada, un administrador deberá aprobarla', 'CERRAR', {
      duration: 4000
    });

  }

  cancelarSolicitud(id: string, arreglo: Array<any>, user: any) {
    arreglo = arreglo.filter(item => item.userId !== user.uid)

    this.vs.actualizar(id,
      { pendientes: arreglo }
    );

    this.snackBar.open('Su solicitud ha sido cancelada', 'CERRAR', {
      duration: 4000
    });

  }


  checkVecinoPendiente(pendientes: Array<any>, user): boolean {

    return pendientes = pendientes.find(item =>
      item.userId == user.uid
    )

  }

  verUsuarios(pendientes: any, vecinos: any, admin: any, titulo: any, vecindarioId: string, vecindarioNombre: string) {
    // this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(ListaUsuariosComponent, this.modalOption);
    modalRef.componentInstance.pendientes = pendientes;
    modalRef.componentInstance.vecinos = vecinos;
    modalRef.componentInstance.admin = admin;
    modalRef.componentInstance.titulo = titulo;
    modalRef.componentInstance.vecindarioId = vecindarioId;
    modalRef.componentInstance.vecindarioNombre = vecindarioNombre;
  }

  checkVecino(vecinos: Array<any>, user: any): boolean {

    return vecinos = vecinos.find(item =>
      item.userId == user.uid)

  }

  salirVecindario(vecindarioId: string, vecinos: Array<any>, admin: Array<any>, user: any) {
    var administradores = admin
    var vecinos_copia = vecinos
    var vecindariosArreglo: Array<any> = user.vecindarios;
    var actual = false;

    administradores = administradores.filter(item => item.userId !== user.uid)
    vecinos_copia = vecinos_copia.filter(item => item.userId !== user.uid)

    this.vs.actualizar(vecindarioId,
      {
        vecinos: vecinos_copia,
        admin: administradores
      }
    );

    this.authService.getUsuario(user.uid).subscribe(
      user => {
        vecindariosArreglo = user.vecindarios;
        vecindariosArreglo = vecindariosArreglo.filter(item => item.vecindarioId !== vecindarioId)
        if (user.actual == vecindarioId) {
          actual = true;
        }
      },
      error => console.log("onError", error)
    );

    setTimeout(() => {
      if (actual) {
        this.authService.updateUsuario(user.uid, {
          actual: null
        });
      }
      this.authService.updateUsuario(user.uid, {
        vecindarios: vecindariosArreglo
      });
    }, 1000);
    this.snackBar.open('Has salido de la comunidad', 'CERRAR', {
      duration: 4000
    });

  }

  mostrarDescripcion(vecindarioId: any) {
    this.mostrarMas = vecindarioId;
  }

  checkAdminBarrio(admins: Array<any>, user: any): boolean {
    return admins = admins.find(item =>
      item.userId == user.uid
    )

  }

  confirmarEliminar(vecindario:any){
    //  this.modalOption.backdrop = 'static';
     this.modalOption.keyboard = false;
    //  this.modalOption.windowClass = { 'modal-dialog-centered' };
     const modalRef = this.modalService.open(ConfirmarEliminarComponent, this.modalOption);
     modalRef.componentInstance.vecindario = vecindario;
  }

}
