import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { AuthService } from '../../core/auth.service';
import { CategoriasService } from '../../core/categorias.service';
import { NoticiasService } from '../../core/noticias.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { NoticiasComponent } from '../noticias/noticias.component';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias$: any;
  categorias: any;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  separatorKeysCodes = [ENTER, COMMA];
  nomCat: any = null;
  selected = 'Todas';
  vecindario: any;
  constructor(public vs: VecindariosService, public nc: NoticiasComponent, public cs: CategoriasService, public ns: NoticiasService, public authService: AuthService) { }
  ngOnInit() {
    this.categorias$ = this.cs.getCategorias(this.authService.vecindarioId);
    this.categorias = this.cs.getCategorias(this.authService.vecindarioId);
    this.vecindario = this.vs.getVecindario(this.authService.vecindarioId);
  }
  agregar(arreglo: Array<any>, event: MatChipInputEvent) {
    let input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      arreglo.push({ nombre: value.trim() });
    }
    if (input) {
      input.value = '';
    }
    this.cs.actualizar(this.authService.vecindarioId,
      { cat_noticias: arreglo }
    );
    return
  }
  eliminar(arreglo: Array<any>, nombre) {
    arreglo = arreglo.filter(item => item.nombre !== nombre);
    this.cs.actualizar(this.authService.vecindarioId,
      { cat_noticias: arreglo }
    );
  }
  filtrar(categoria: any) {
    this.ns.filtroCat$.next(categoria);
    this.nomCat = categoria;
    this.nc.maxNoticias = 10;
  }
  ngOnDestroy() {
    this.filtrar(null);
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
