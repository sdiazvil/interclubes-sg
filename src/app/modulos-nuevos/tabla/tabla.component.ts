import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'nombre', 'registro','puntos'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  usuarios: any;
  buscar = '';
  constructor(private authService: AuthService,private pagina: MatPaginatorIntl,) {
    this.usuarios = this.authService.getUsuarios();
    pagina.itemsPerPageLabel = 'Jugadores por página'; 
    pagina.nextPageLabel = 'Siguiente'; 
    pagina.previousPageLabel = 'Anterior'; 
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Create 100 users
    const users: UserData[] = [];

    setTimeout(() => {
      // 
      for (let i = 0; i < this.authService.usuariosArreglo.length; i++) {
        users.push(createNewUser(i+1, this.authService.usuariosArreglo[i].displayName, this.authService.usuariosArreglo[i].vecindarios, this.authService.usuariosArreglo[i].fecha_registro,this.authService.usuariosArreglo[i].admin,this.authService.usuariosArreglo[i].uid));
      }
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000);

    // Assign the data to the data source for the table to render

  }
  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}


function createNewUser(id: number, name: any, vecindarios:Array<any>, registro: any, gestion:boolean, userId: string): UserData {

  return {
    id: id.toString(),
    nombre: name,
    vecindarios: vecindarios,
    registro: registro,
    gestion: gestion,
    userId: userId
  };
}

export interface UserData {
  id: string;
  nombre: string;
  vecindarios: Array<any>;
  registro: any;
  gestion: boolean;
  userId: string;
}