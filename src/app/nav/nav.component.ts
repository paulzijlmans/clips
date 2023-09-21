import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { ModalId } from '../shared/modal/modal';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  constructor(public modal: ModalService) {}

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal(ModalId.AUTH);
  }
}
