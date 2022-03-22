import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { AuthService } from '../../core/auth.service';
import { CategoriasService } from '../../core/categorias.service';
import { GruposService } from '../../core/grupos.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { GruposComponent } from '../grupos/grupos.component';
@Component({
  selector: 'app-catgrupos',
  templateUrl: './catgrupos.component.html',
  styleUrls: ['./catgrupos.component.css']
})
export class CatgruposComponent implements OnInit {
  categorias$: any;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  vecindario: any;
  separatorKeysCodes = [ENTER, COMMA];
  nomCat: any = null;
  constructor(public vs: VecindariosService, public gc: GruposComponent, public cs: CategoriasService, public gs: GruposService, public authService: AuthService) { }
  ngOnInit() {
    this.categorias$ = this.cs.getCategoriasGrupos(this.authService.vecindarioId);
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
    this.cs.actualizarGrupos(this.authService.vecindarioId,
      { cat_grupos: arreglo }
    );
    return
  }
  eliminar(arreglo: Array<any>, nombre) {
    arreglo = arreglo.filter(item => item.nombre !== nombre);
    this.cs.actualizarGrupos(this.authService.vecindarioId,
      { cat_grupos: arreglo }
    );
  }
  filtrar(categoria: any) {
    this.gs.filtroCat$.next(categoria);
    this.nomCat = categoria;
    this.gc.maximo = 3;
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
