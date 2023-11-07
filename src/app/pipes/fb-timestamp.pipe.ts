import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';

@Pipe({
  name: 'fbTimestamp',
})
export class FbTimestampPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: firebase.firestore.FieldValue | undefined) {
    if (!value) {
      return '';
    }
    return this.datePipe.transform(
      (value as firebase.firestore.Timestamp).toDate(),
      'mediumDate'
    );
  }
}
