import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, firstValueFrom, from, map, of, switchMap } from 'rxjs';
import IClip from '../models/clip.model';
import { SortOrder } from '../video/manage/manage.component';

export const clipResolver: ResolveFn<Observable<IClip | null>> = (
  route: ActivatedRouteSnapshot
) => {
  return inject(ClipService)
    .clipsCollection.doc(route.params['id'])
    .get()
    .pipe(
      map(snapshot => {
        const data = snapshot.data();
        if (!data) {
          inject(Router).navigate(['/']);
          return null;
        }
        return data;
      })
    );
};

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  clipsCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] = [];
  pendingRequests = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
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

  async getClips() {
    if (this.pendingRequests) {
      true;
    }
    this.pendingRequests = true;

    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6);

    const { length } = this.pageClips;

    if (length) {
      const lastDocID = this.pageClips[length - 1].docID;
      const lastDoc = await firstValueFrom(
        this.clipsCollection.doc(lastDocID).get()
      );
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    snapshot.forEach(doc => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data(),
      });
    });
    this.pendingRequests = false;
  }
}
