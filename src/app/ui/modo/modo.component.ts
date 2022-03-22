import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
@Component({
  selector: 'app-modo',
  templateUrl: './modo.component.html',
  styleUrls: ['./modo.component.css']
})
export class ModoComponent implements OnInit {
  constructor(public authService: AuthService) { }
  ngOnInit() {
  }
  checkBarra(variable) {
    if (variable) {
      return true;
    } else {
      return false;
    }
  }
  toggleModo(modo: boolean, userId: string) {
    if (modo) {
      this.authService.updateUsuario(userId,
        {
          modo_edicion: true,
        }
      );
    } if (!modo) {
      this.authService.updateUsuario(userId,
        {
          modo_edicion: false,
        }
      );
    }
  }
}
