import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { from, map, of, switchMap } from 'rxjs';
import IClip from '../models/clip.model';
import { SortOrder } from '../video/manage/manage.component';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.clipsCollection = db.collection('clips');
  }

  createClip(data: IClip) {
    return this.clipsCollection.add(data);
  }

  getUserClips(sort: SortOrder) {
    return this.auth.user.pipe(
      switchMap(user =>
        user
          ? this.clipsCollection.ref
              .where('uid', '==', user.uid)
              .orderBy('timestamp', sort)
              .get()
          : of([])
      ),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({ title });
  }

  deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    );

    return clipRef.delete().pipe(
      switchMap(() => from(this.clipsCollection.doc(clip.docID).delete())),
      switchMap(() => screenshotRef.delete())
    );
  }
}
