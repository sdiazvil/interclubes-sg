import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class SearchFilterPipe implements PipeTransform {
  // transform(value: any, input: string) {
  //   if (!value) {
  //     return [];
  //   }
  //   if (!input) {
  //     return value;
  //   }
  //   var valuesArr = []
  //   if (input) {
  //     input = input.toLowerCase();
  //     return value.filter(function (el: any) {
  //       valuesArr = Object.values(el)
  //       for (var i in valuesArr) {
  //         return valuesArr != null && valuesArr[i] != null && valuesArr[i] != undefined && valuesArr[i].toLowerCase().indexOf(input) > -1;
  //       }
  //     })
  //   }
  //   return value;
  // }
  public transform(value, keys: string, term: string) {

    if (!term) return value;
    return (value || []).filter(item => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));

  }
}
