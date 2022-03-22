import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements AfterViewInit, OnInit{

  displayedColumns = ['id', 'nombre', 'vecindarios', 'registro','gestion'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  usuarios: any;
  buscar = '';
  constructor(private authService: AuthService,private pagina: MatPaginatorIntl,) {
    this.usuarios = this.authService.getUsuarios();
    pagina.itemsPerPageLabel = 'Usuarios por página'; 
    pagina.nextPageLabel = 'Siguiente'; 
    pagina.previousPageLabel = 'Anterior'; 
  }

  agregarAdmin(userId: string, variable:boolean){
    // console.log(userId)
    if(variable){
      this.authService.updateUsuario(userId,
        {
          admin:false
        });
        this.ngAfterViewInit();
      }else{
      this.authService.updateUsuario(userId,
        {
          admin:true
        });
        this.ngAfterViewInit();
      }
  }

  ngOnInit(){
    // this.authService.updateUsuario('tPcikw20wFeRKL0SfD29kwuSsoP2', {
    //   vecindarios: [
    //     {
    //       nombre: 'Brisas del Mar',
    //       vecindarioId: '6EsFCynobmuf5I17DY9a'
    //     }
    //   ]
    // });
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    // Create 100 users
    const users: UserData[] = [];

    setTimeout(() => {
      // console.log(this.authService.itemsArray)
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

/** Builds and returns a new User. */
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

/** Constants used to fill up our data base. */
// const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//   'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
// const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//   'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//   'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  nombre: string;
  vecindarios: Array<any>;
  registro: any;
  gestion: boolean;
  userId: string;
}