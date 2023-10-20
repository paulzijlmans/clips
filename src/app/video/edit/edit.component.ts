import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { ModalId } from 'src/app/shared/modal/modal';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnChanges, OnDestroy {
  ModalId = ModalId;
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait! Updating clip.';

  clipId = new FormControl('', { nonNullable: true });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    id: this.clipId,
    title: this.title,
  });

  @Input()
  activeClip: IClip | null = null;

  @Output()
  update = new EventEmitter();

  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) {}

  ngOnInit(): void {
    this.modal.register(ModalId.EDIT_CLIP);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipId.setValue(this.activeClip.docID ?? '');
    this.title.setValue(this.activeClip.title);
  }

  ngOnDestroy(): void {
    this.modal.unregister(ModalId.EDIT_CLIP);
  }

  async saveChanges() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Updating clip.';

    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMessage = 'Something went wrong. Try again later.';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Success!';
  }
}
