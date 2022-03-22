import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../core/encuestas.service';
@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css'],
})
export class EncuestaComponent implements OnInit {
  id: string;
  encuesta: any;
  formulario: FormGroup;
  mensaje: string;
  mostrar: boolean;
  correcto;
  cargando = true;
  constructor(
    public fb: FormBuilder, private es: EncuestasService, private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    this.mostrar = false;
    this.activatedRoute.params.forEach((urlParameters) => {
      this.id = urlParameters['id'];
      this.encuesta = this.es.getPorId(this.id).subscribe(encuesta => this.encuesta = encuesta)
    });
    this.formulario = this.fb.group({
      'password': [''],
    });
    setTimeout(() =>
    this.cargando = false, 2000);
  }
  get password() { return this.formulario.get('password') }
  verificarPassword(pass: string) {
    if (pass == this.password.value) {
      this.mostrar = true;
      this.correcto = "Contraseña correcta.";
      setTimeout(() => {
        this.correcto = null;
      }, 3000);
    } else {
      this.mensaje = "Contraseña incorrecta";
      setTimeout(() => {
        this.mensaje = null;
      }, 3000);
    }
  }
}
