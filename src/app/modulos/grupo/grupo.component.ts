import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/map';
import { AuthService } from '../../core/auth.service';
import { GruposService } from '../../core/grupos.service';
import { ArchivoSiete } from '../../interfaces/archivo-siete';
@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {
  id: string;
  grupo: any;
  maxCom = -6;
  revMax = 6;
  formulario: FormGroup;
  @ViewChild('panel') public panel: ElementRef;
  imageSrc: any;
  comentarioId;
  comentarioActual: any;
  listaArchivos: ArchivoSiete;
  loading = false;
  mostrar = false;
  constructor(config: NgbCarouselConfig, public fb: FormBuilder, public authService: AuthService, private gs: GruposService, private activatedRoute: ActivatedRoute) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
  }
  ngOnInit() {
    this.activatedRoute.params.forEach((urlParameters) => {
      this.id = urlParameters['id'];
      this.grupo = this.gs.getPorId(this.id).subscribe(grupo => this.grupo = grupo)
    });
    this.formulario = this.fb.group({
      'texto': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
    });
  }
  ngAfterViewInit() {
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
    }
  }
  get texto() { return this.formulario.get('texto') }
  meGusta(arreglo: Array<any>, userId: string) {
    arreglo.push({
      userId: userId,
    });
    this.gs.actualizar(this.id,
      { megusta: arreglo }
    );
  }
  eliminarMeGusta(arreglo: Array<any>, userId: string) {
    arreglo = arreglo.filter(item => item.userId !== userId)
    this.gs.actualizar(this.id,
      { megusta: arreglo }
    );
  }
  checkMeGusta(arreglo: Array<any>, userId: string): boolean {
    return arreglo = arreglo.find(item =>
      item.userId == userId
    )
  }
  comentar(user: any, arreglo: Array<any>) {
    var texto_con_espacio = this.texto.value.replace(new RegExp('\n', 'g'), "<br>");
    arreglo.push({
      userId: user.uid,
      comentario: texto_con_espacio,
      fecha: new Date().getTime(),
      id: this.gs.crearId(),
      userRef: this.authService.getUserPub(user.uid).ref,
    });
    this.gs.actualizar(this.id,
      { comentarios: arreglo,
        enlinea: this.gs.timestamp,
      }
    );
    this.formulario.reset();
  }
  cargarMas() {
    this.maxCom = this.maxCom - 3;
    this.revMax = this.revMax + 3;
  }
  eliminarComentario(id: string, arreglo: Array<any>) {
    arreglo = arreglo.filter(item => item.id !== id)
    this.gs.actualizar(this.id,
      { comentarios: arreglo }
    );
  }
  mostrarDescripcion() {
    this.mostrar = true;
  }
}
