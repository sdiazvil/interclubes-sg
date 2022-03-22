import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  transform(value: any) {
    let x = value.split(" ");
    return(x[0]);
  }
  // transform(value: any) {
  //   return value.substr(0,value.indexOf(' '));
  // }

}
