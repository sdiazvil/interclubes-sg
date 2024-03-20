import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { AuthService } from '../../core/auth.service';
import { PartidosService } from '../../core/partidos.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'nombre', 'pg', 'sg'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  usuarios: any;
  buscar = '';

  partidos: any;

  ganados_jugador1 = 0;
  ganados_jugador2 = 0;

  sets_ganados_jugador1 = 0;
  sets_ganados_jugador2 = 0;
  constructor(private authService: AuthService, private pagina: MatPaginatorIntl, public partidosService: PartidosService) {
    this.usuarios = this.authService.getUsuarios();
    pagina.itemsPerPageLabel = 'Jugadores por página';
    pagina.nextPageLabel = 'Siguiente';
    pagina.previousPageLabel = 'Anterior';
  }

  ngOnInit() {
    this.partidosService.getPartidos().subscribe(partidos => {
      this.partidos = partidos
      this.partidos.forEach(partido => {
        if (partido.ganador == 'jugador1') {
          this.ganados_jugador1++;
        }
        if (partido.ganador == 'jugador2') {
          this.ganados_jugador2++;
        }
        this.sets_ganados_jugador1 = this.sets_ganados_jugador1 + partido.sets_ganados_jugador1;
        this.sets_ganados_jugador2 = this.sets_ganados_jugador2 + partido.sets_ganados_jugador2;
        const users: UserData[] = [];
        if (this.ganados_jugador1 > this.ganados_jugador2) {
          users.push(createNewUser(1, 'Club de Tenis Serena Golf', this.ganados_jugador1, this.sets_ganados_jugador1), createNewUser(2, 'Club de Tenis Illapel', this.ganados_jugador2, this.sets_ganados_jugador2));
          this.dataSource = new MatTableDataSource(users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } 
        if (this.ganados_jugador1 < this.ganados_jugador2) {
          users.push(createNewUser(1, 'Club de Tenis Illapel', this.ganados_jugador2, this.sets_ganados_jugador2), createNewUser(2, 'Club de Tenis Serena Golf', this.ganados_jugador1, this.sets_ganados_jugador1));
          this.dataSource = new MatTableDataSource(users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        if (this.ganados_jugador1 == this.ganados_jugador2) {
          if(this.sets_ganados_jugador1 > this.sets_ganados_jugador2){
            users.push(createNewUser(1, 'Club de Tenis Serena Golf', this.ganados_jugador1, this.sets_ganados_jugador1), createNewUser(2, 'Club de Tenis Illapel', this.ganados_jugador2, this.sets_ganados_jugador2));
            this.dataSource = new MatTableDataSource(users);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }else{
            users.push(createNewUser(1, 'Club de Tenis Illapel', this.ganados_jugador2, this.sets_ganados_jugador2), createNewUser(2, 'Club de Tenis Serena Golf', this.ganados_jugador1, this.sets_ganados_jugador1));
            this.dataSource = new MatTableDataSource(users);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }
      });
    });

  }

  ngAfterViewInit() {
    // Create 100 users
    setTimeout(() => {

    }, 1000);

    // Assign the data to the data source for the table to render

  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}


function createNewUser(id: number, name: any, pg: any, sg: any): UserData {

  return {
    id: id.toString(),
    nombre: name,
    pg: pg,
    sg: sg
    // vecindarios: vecindarios,
    // registro: registro,
    // gestion: gestion,
    // userId: userId
  };
}

export interface UserData {
  id: string;
  nombre: string;
  pg: number;
  sg: number;
  // vecindarios: Array<any>;
  // registro: any;
  // gestion: boolean;
  // userId: string;
}