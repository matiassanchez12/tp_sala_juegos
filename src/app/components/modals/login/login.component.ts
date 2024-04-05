import { Component, EventEmitter, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isOpenModal = signal(false);

  modalService = inject(ModalService);

  constructor() {
    this.modalService.watch().subscribe((data) => {
      const isOpen = data.state === 'open' && data.type === 'login';
      this.isOpenModal.set(isOpen);
    })
  }

  handleCloseModal() {
    this.modalService.close('login')
  }

  handleOpenModal() {
    this.modalService.close('login')
    this.modalService.open('register')
  }
}
