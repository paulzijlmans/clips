import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ModalId } from 'src/app/shared/modal/modal';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent implements OnInit, OnDestroy {
  ModalId = ModalId;

  constructor(public modal: ModalService) {}

  ngOnInit(): void {
    this.modal.register(ModalId.AUTH);
  }

  ngOnDestroy(): void {
    this.modal.unregister(ModalId.AUTH);
  }
}
