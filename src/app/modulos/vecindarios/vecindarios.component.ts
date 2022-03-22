import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from 'angularfire2/storage';
import { AuthService } from '../../core/auth.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { CIUDADES } from '../../interfaces/ciudades';
import { AgregarVecindarioComponent } from '../agregar-vecindario/agregar-vecindario.component';
import { ConfirmarEliminarComponent } from '../confirmar-eliminar/confirmar-eliminar.component';
import { ListaUsuariosComponent } from '../lista-usuarios/lista-usuarios.component';
@Component({
  selector: 'app-vecindarios',
  templateUrl: './vecindarios.component.html',
  styleUrls: ['./vecindarios.component.css']
})
export class VecindariosComponent implements OnInit {
  modalOption: NgbModalOptions = {};
  vecindarios$: any;
  usuarios$: any;
  mostrarVisibles = true;
  users: any;
  maximo = 6;
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
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(AgregarVecindarioComponent, this.modalOption);
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
    this.vs.eliminar(vecindario.id);
    this.snackBar.open('La comunidad ha sido eliminada correctamente.', 'CERRAR', {
      duration: 4000
    });
  }
  cargarMas() {
    this.maximo += 6;
  }
  filtrarComuna(comuna: any) {
    this.vs.filtroComuna$.next(comuna);
  }
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
    this.buscar = null;
  }
  itemTrackBy(index: number, item) {
    return item.id;
  }
  solicitarUnirse(id: string, arreglo: Array<any>, user: any) {
    arreglo.push({
      userId: user.uid,
      displayName: user.displayName,
      userRef: this.authService.getUserPub(user.uid).ref,
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
     this.modalOption.keyboard = false;
     const modalRef = this.modalService.open(ConfirmarEliminarComponent, this.modalOption);
     modalRef.componentInstance.vecindario = vecindario;
  }
}
