import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import IClip from '../models/clip.model';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class ClipComponent implements OnInit {
  player?: Player;
  clip?: IClip;

  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);
    this.route.data.subscribe(data => {
      this.clip = data['clip'];
      this.player?.src({
        src: this.clip?.url,
        type: 'video/mp4',
      });
    });
  }
}
