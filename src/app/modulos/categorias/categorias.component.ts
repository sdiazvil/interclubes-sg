import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriasService } from '../../core/categorias.service';
import { NoticiasService } from '../../core/noticias.service';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AuthService } from '../../core/auth.service';
import { NoticiasComponent } from '../noticias/noticias.component';
import { VecindariosService } from '../../core/vecindarios.service';

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

  // Enter, comma
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
