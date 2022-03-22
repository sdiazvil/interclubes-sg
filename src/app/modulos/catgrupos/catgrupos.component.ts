import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriasService } from '../../core/categorias.service';
import { NoticiasService } from '../../core/noticias.service';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AuthService } from '../../core/auth.service';
import { NoticiasComponent } from '../noticias/noticias.component';
import { GruposComponent } from '../grupos/grupos.component';
import { GruposService } from '../../core/grupos.service';
import { VecindariosService } from '../../core/vecindarios.service';


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

  // Enter, comma
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

    // Add our fruit
    if ((value || '').trim()) {
      arreglo.push({ nombre: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    // arreglo.push({
    //   nombre: categoria
    // });

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
