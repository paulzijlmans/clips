import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, map, switchMap } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { ModalId } from 'src/app/shared/modal/modal';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit, OnDestroy {
  videoOrder = SortOrder.DESC;
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  subscription?: Subscription;
  sort$: BehaviorSubject<SortOrder>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(map(params => params['sort']))
      .subscribe(sortOrder => {
        this.videoOrder =
          sortOrder === SortOrder.ASC ? sortOrder : SortOrder.DESC;
        this.sort$.next(this.videoOrder);
      });
    this.sort$
      .pipe(switchMap(sort => this.clipService.getUserClips(sort)))
      .subscribe(docs => {
        this.clips = [];
        docs.forEach(doc => {
          this.clips.push({
            docID: doc.id,
            ...doc.data(),
          });
        });
      });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModal(ModalId.EDIT_CLIP);
  }

  update(clip: IClip) {
    this.clips.forEach((clip, index) => {
      if (clip.docID === clip.docID) {
        this.clips[index].title = clip.title;
      }
    });
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();
    this.subscription = this.clipService.deleteClip(clip).subscribe(() => {
      this.clips.forEach((clip, index) => {
        if (clip.docID === clip.docID) {
          this.clips.splice(index, 1);
        }
      });
    });
  }

  async copyToClipboard($event: MouseEvent, docID: string | undefined) {
    $event.preventDefault();
    if (!docID) {
      return;
    }
    const url = `${location.origin}/clip/${docID}`;
    await navigator.clipboard.writeText(url);
    alert('Link Copied!')
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
