import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../core/encuestas.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { EncuestasComponent } from '../encuestas/encuestas.component';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css'],
  // providers: [EncuestasComponent]
})

export class EncuestaComponent implements OnInit {
  id: string;
  encuesta: any;
  // encuestas: any;
  formulario: FormGroup;

  mensaje: string;

  mostrar: boolean;

  correcto;

  cargando = true;

  constructor(
    // public ec: EncuestasComponent, 
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

    // this.encuestas = this.es.getEncuestas().subscribe(encuestas => this.encuestas = encuestas)
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

  // agregar(){
  //   this.ec.open();
  // }

}
