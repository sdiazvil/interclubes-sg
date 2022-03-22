import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  pure: false
})
export class FiltroPipe implements PipeTransform {

  transform(vecindarios: Array<any>, userId:string): Array<any> {
    var arreglo: Array<any> = [];
    vecindarios.forEach(vecindario => {
      for(var i=0; i<vecindario.vecinos.length;i++){
        if(vecindario.vecinos[i].userId==userId){
          arreglo.push({
            nombre: vecindario.nombre,
            vecindarioId: vecindario.id
          });
        }
      }
    });
    return arreglo;
  }

}
