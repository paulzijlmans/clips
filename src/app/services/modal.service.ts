import { Injectable } from '@angular/core';
import { ModalId } from '../shared/modal/modal';

interface IModal {
  id: ModalId;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() {}

  register(id: ModalId) {
    this.modals.push({ id, visible: false });
  }

  unregister(id: ModalId) {
    this.modals = this.modals.filter((element) => element.id !== id);
  }

  isModalOpen(id: ModalId): boolean {
    return !!this.modals.find((element) => element.id === id)?.visible;
  }

  toggleModal(id: ModalId) {
    const modal = this.modals.find((element) => element.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
