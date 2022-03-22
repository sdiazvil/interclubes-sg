import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NoticiasService } from '../../core/noticias.service';
@Component({
  selector: 'app-bajada',
  templateUrl: './bajada.component.html',
  styleUrls: ['./bajada.component.css']
})
export class BajadaComponent implements OnInit {
  id: string;
  noticia: any;
  formulario: FormGroup;
  alerta = false;
  constructor(public fb: FormBuilder, public ns: NoticiasService, private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    this.activatedRoute.params.forEach((urlParameters) => {
      this.id = urlParameters['id'];
      this.noticia = this.ns.getPorId(this.id).subscribe(noticia => this.noticia = noticia)
    });
    this.formulario = this.fb.group({
      'texto': [''],
    });
  }
  get texto() { return this.formulario.get('texto') }
  agregarBajada(arreglo: Array<any>, foto: any) {
    for(var i = 0; i<arreglo.length; i++){
      if(arreglo[i].photoURL == foto.photoURL){
        arreglo[i]= {
          photoURL: foto.photoURL,
          path: foto.path,
          bajada: this.texto.value
        }
      }
    }
    this.ns.actualizar(this.id,
      { fotos: arreglo }
    )
    this.formulario.reset();
    this.alerta = true;
    setTimeout(() =>
      this.alerta = false, 3000);
  }
}
