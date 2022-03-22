import { Component, Input, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'mostrar-mas',
  templateUrl: './mostrar-mas.component.html',
  styleUrls: ['./mostrar-mas.component.css']
})
export class MostrarMasComponent implements OnChanges {
  @Input() texto: string;
  @Input() largoMax: number = 100;
  textoActual: string;
  ocultar: boolean = true;

  public colapsado: boolean = true;

  constructor(private elementRef: ElementRef) {

  }
  mostrar() {
      this.colapsado = !this.colapsado;
      this.determinarLargo();
  }

  determinarLargo() {
      if (this.texto.length <= this.largoMax) {
          this.textoActual = this.texto;
          this.colapsado = false;
          this.ocultar = true;
          return;
      }
      this.ocultar = false;
      if (this.colapsado == true) {
          this.textoActual = this.texto.substring(0, this.largoMax) + "...";
      } else if (this.colapsado == false) {
          this.textoActual = this.texto;
      }

  }

  ngOnChanges() {
      this.determinarLargo();
  }


}
