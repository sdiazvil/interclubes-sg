import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from 'angularfire2/storage';
import { AuthService } from '../../core/auth.service';
import { GruposService } from '../../core/grupos.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { AgregarGrupoComponent } from '../agregar-grupo/agregar-grupo.component';
@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {
  grupos: any;
  misgrupos: any;
  maximo = 9;
  modalOption: NgbModalOptions = {};
  vecindario:any;
  constructor(public vs: VecindariosService, public snackBar: MatSnackBar, public authService: AuthService, private gs: GruposService, private modalService: NgbModal, private storage: AngularFireStorage) {
  }
  ngOnInit() {
    this.grupos = this.gs.getGruposFiltrable();
    this.gs.filtroVecindario$.next(this.authService.vecindarioId);
    this.misgrupos = this.gs.getGrupos(this.authService.vecindarioId);
    this.vecindario = this.vs.getVecindario(this.authService.vecindarioId);
  }
  checkIntegrante(integrantes: Array<any>, userId: string): boolean {
    return integrantes = integrantes.find(item =>
      item.userId == userId
    )
  }
  salirGrupo(id: string, arreglo: Array<any>, userId: string) {
    arreglo = arreglo.filter(item => item.userId !== userId)
    this.gs.actualizar(id,
      { integrantes: arreglo }
    );
    this.snackBar.open('Has salido del grupo', 'CERRAR', {
      duration: 4000
    });
  }
  unirse(id: string, arreglo: Array<any>, userId: string) {
    arreglo.push({
      userId: userId,
    });
    this.gs.actualizar(id,
      { integrantes: arreglo }
    );
  }
  checkMisGrupos(grupos: any, userId: string): Array<any> {
    var misgrupos:Array<any> = [];
    for(var i=0; i<grupos.length;i++){
      grupos[i].integrantes.find(item => {
        if(item.userId==userId){
          misgrupos.push(grupos[i]);
        }
      })
    }
    return misgrupos;
  }
  open() {
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(AgregarGrupoComponent, this.modalOption);
  }
  eliminar(grupo: any) {
    if(grupo.fotos){
      grupo.fotos.forEach(foto => {
        this.storage.ref(foto.path).delete();
      });  
    }
    this.gs.eliminar(grupo.id);
    this.snackBar.open('El grupo ha sido eliminado correctamente.', 'CERRAR', {
      duration: 4000
    });
  }
  cargarMas() {
    this.maximo = this.maximo + 6;
  }
  itemTrackBy(index: number, item) {
    return item.id;
  }
  checkAdminBarrio(admins: Array<any>, user: any): boolean {
    return admins = admins.find(item =>
      item.userId == user.uid
    )
  }
}
