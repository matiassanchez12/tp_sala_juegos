import {
  Component,
  HostBinding,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/modals/login/login.component';
import { ModalService } from './services/modal.service';
import { RegisterComponent } from './components/modals/register/register.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private darkMode = signal(false);
  protected readonly darkMode$ = computed(() => this.darkMode());

  title = 'tp-sala-juegos';

  isOpenModalLogin = signal(false);
  isOpenModalRegister = signal(false);
  modalService = inject(ModalService);

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  setDarkMode() {
    this.darkMode.set(!this.darkMode());
  }

  constructor() {
    this.setDarkMode();

    this.modalService.watch().subscribe((data) => {
      const isOpenLogin = data.state === 'open' && data.type === 'login';
      const isOpenRegister = data.state === 'open' && data.type === 'register';

      this.isOpenModalLogin.set(isOpenLogin);
      this.isOpenModalRegister.set(isOpenRegister);
    });
  }

  handleOpenModal() {
    this.modalService.open('login');
  }

  handleCloseModal() {
    this.modalService.close('login');
  }
}
