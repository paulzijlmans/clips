import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';
import { ModalId } from '../shared/modal/modal';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  constructor(public modal: ModalService, public auth: AuthService) {}

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal(ModalId.AUTH);
  }

  async logout($event: Event) {
    $event.preventDefault();
    await this.auth.logout();
  }
}
