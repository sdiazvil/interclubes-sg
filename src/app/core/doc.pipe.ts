import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
@Pipe({
  name: 'doc'
})
export class DocPipe implements PipeTransform {
  constructor(private afs: AngularFirestore) {}
  transform(value: any): any {
    return this.afs.doc(value.path).valueChanges();
  }
}
