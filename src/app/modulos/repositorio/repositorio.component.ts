import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import { AuthService } from '../../core/auth.service';
import { RepositorioService } from '../../core/repositorio.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { ArchivoCinco } from '../../interfaces/archivo-cinco';
@Component({
  selector: 'app-repositorio',
  templateUrl: './repositorio.component.html',
  styleUrls: ['./repositorio.component.css']
})
export class RepositorioComponent implements OnInit {
  cerrar: boolean = true;
  panelOpenState: boolean = false;
  listaArchivos: ArchivoCinco;
  carpetas: any;
  mostrarVisibles = true;
  mostrarArchivo = null;
  vecindario : any;
  constructor(public vs: VecindariosService, public authService: AuthService, public rs: RepositorioService, private storage: AngularFireStorage, public snackBar: MatSnackBar) { }
  ngOnInit() {
    this.carpetas = this.rs.getCarpetasVisibles(this.authService.vecindarioId);
    this.vecindario = this.vs.getVecindario(this.authService.vecindarioId);
  }
  ngAfterInit(){
  }
  cargar(event: FileList, arreglo: Array<any>, idCarpeta: string) {
    let archivos = event;
    let archivosIndex = _.range(archivos.length)
    _.each(archivosIndex, (index) => {
      this.listaArchivos = new ArchivoCinco(archivos[index]);
      this.rs.cargar(this.listaArchivos, arreglo, idCarpeta);
    });
    this.snackBar.open('Los archivos se encuentran en proceso de carga, apareceran pronto en el listado', 'CERRAR', {
      duration: 4000
    });
  }
  eliminarCarpeta(carpeta: any) {
    if(carpeta.archivos){
      carpeta.archivos.forEach(archivo => {
        this.storage.ref(archivo.path).delete();
      });
    }
    this.rs.eliminar(carpeta.id);
    this.snackBar.open('La carpeta ha sido eliminada correctamente.', 'CERRAR', {
      duration: 4000
    });
  }
  eliminarArchivo(arreglo: Array<any>, path: string, carpetaId: string) {
    arreglo = arreglo.filter(item => item.path !== path)
    this.storage.ref(path).delete();
    this.rs.actualizar(carpetaId,
      { archivos: arreglo }
    );
    this.snackBar.open('El archivo ha sido eliminado correctamente.', 'CERRAR', {
      duration: 4000
    });
  }
  toggleEncuestas(visibles: boolean) {
    if (visibles) {
      this.carpetas = this.rs.getCarpetasVisibles(this.authService.vecindarioId);
      this.mostrarVisibles = true;
    }
    if (!visibles) {
      this.carpetas = this.rs.getCarpetasOcultas(this.authService.vecindarioId);
      this.mostrarVisibles = false;
    }
  }
  toggleOculto(oculto: boolean, id: string) {
    if (oculto) {
      this.rs.actualizar(id,
        {
          oculto: true,
        }
      );
    } if (!oculto) {
      this.rs.actualizar(id,
        {
          oculto: false,
        }
      );
    }
  }
  mostrar(url: any, el: HTMLElement) {
    this.cerrar = true;
    this.mostrarArchivo = url;
    setTimeout(() => {
      el.scrollIntoView();
    }, 1000);
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  checkAdminBarrio(admins: Array<any>, user: any): boolean {
    return admins = admins.find(item =>
      item.userId == user.uid
    )
  }
}
