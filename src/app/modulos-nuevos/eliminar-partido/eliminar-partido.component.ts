import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import { PartidosService } from '../../core/partidos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-eliminar-partido',
  templateUrl: './eliminar-partido.component.html',
  styleUrls: ['./eliminar-partido.component.css']
})
export class EliminarPartidoComponent implements OnInit {


  cargando = false;
  constructor(
    public activeModal: NgbActiveModal,

  ) { }


  ngOnInit() {
   
  }

  eliminar(){
    this.activeModal.close('success');
  }

  cerrarModalSF() {
    this.activeModal.close();
  }
}

