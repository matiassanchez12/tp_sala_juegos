import {
  Component,
  HostBinding,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/modals/login/login.component';
import { ModalService } from './services/modal.service';
import { RegisterComponent } from './components/modals/register/register.component';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from './components/modals/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    LoginComponent,
    RegisterComponent,
    LoaderComponent
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
  isOpenModalLoader = signal(false);
  userLoggedIn = signal<{name: string} | null>(null);

  modalService = inject(ModalService);
  authService = inject(AuthService);

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  setDarkMode() {
    this.darkMode.set(!this.darkMode());
  }

  constructor(public toastrService: ToastrService) {
    this.setDarkMode();
    
    this.modalService.watchLoader().subscribe((data) => {
      this.isOpenModalLoader.set(data);
    })

    this.modalService.watch().subscribe((data) => {
      const isOpenLogin = data.state === 'open' && data.type === 'login';
      const isOpenRegister = data.state === 'open' && data.type === 'register';
      
      this.isOpenModalLogin.set(isOpenLogin);
      this.isOpenModalRegister.set(isOpenRegister);
    });

    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userLoggedIn.set({name: user.name});
      } else {
        this.userLoggedIn.set(null);
      }
    })
  }

  handleLoggout() {
    this.authService.signOut().then(() => {
      this.toastrService.success('Sesión cerrada con exito!', undefined, {positionClass: 'toast-top-center'});
    })
  }

  handleOpenModal() {
    this.modalService.open('login');
  }

  handleCloseModal() {
    this.modalService.close('login');
  }
}
