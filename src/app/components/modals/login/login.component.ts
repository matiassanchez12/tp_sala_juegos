import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { ModalService } from 'src/app/services/modal.service';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public formLogin: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  isLoading = signal(false);
  isOpenModal = signal(false);
  invalidEmailOrPassword = signal(false);

  modalService = inject(ModalService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: [
        'matias.sanchez.12@gmail.com',
        [Validators.email, this.spacesValidator],
      ],
      password: ['123123', Validators.required],
    });
  }

  constructor(
    private fb: FormBuilder,
    public toastrService: ToastrService,
    public router: Router
  ) {
    this.modalService.watch().subscribe((data) => {
      const isOpen = data.state === 'open' && data.type === 'login';
      this.isOpenModal.set(isOpen);
    });
  }

  async onSubmit(user?: string) {
    this.formLogin.markAllAsTouched();

    if (!this.formLogin.invalid) {
      this.isLoading.set(true);

      let email,
        password = '';

      email = this.formLogin.value.email;
      password = this.formLogin.value.password;

      if (user) {
        email = 'matias.sanchez.121@gmail.com';
        password = '123123';
      }

      this.modalService.open('loader');

      this.authService
        .signIn(email, password)
        .then(() => {
          this.toastrService.success('Usuario logueado con exito!', undefined, {
            positionClass: 'toast-top-center',
          });
          this.handleCloseModal();
        })
        .catch((error: any) => {
          this.invalidEmailOrPassword.set(true);
          console.log(error.message);
        })
        .finally(() => {
          this.isLoading.set(false);
          this.modalService.close('loader');
        });
    }
  }

  handleCloseModal() {
    this.modalService.close('login');
  }

  handleOpenModal() {
    this.modalService.close('login');
    this.modalService.open('register');
  }

  private spacesValidator(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces ? { containsSpaces: true } : null;
  }

  private ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
