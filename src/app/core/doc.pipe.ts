import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Pipe({
  name: 'doc'
})
export class DocPipe implements PipeTransform {

  constructor(private afs: AngularFirestore) {}

  transform(value: any): any {
    return this.afs.doc(value.path).valueChanges();
  }

}
