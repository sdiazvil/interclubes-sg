import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'nombre', 'pg', 'sg', 'gg'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  usuarios: any;
  buscar = '';
  constructor(private authService: AuthService, private pagina: MatPaginatorIntl,) {
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
      users.push(createNewUser(1, 'Club de Tenis Serena Golf', 'cl'), createNewUser(2, 'Club de Tenis Illapel', 'cl'));
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


function createNewUser(id: number, name: any, pais: any): UserData {

  return {
    id: id.toString(),
    nombre: name,
    pais: pais
    // vecindarios: vecindarios,
    // registro: registro,
    // gestion: gestion,
    // userId: userId
  };
}

export interface UserData {
  id: string;
  nombre: string;
  pais: string;
  // vecindarios: Array<any>;
  // registro: any;
  // gestion: boolean;
  // userId: string;
}