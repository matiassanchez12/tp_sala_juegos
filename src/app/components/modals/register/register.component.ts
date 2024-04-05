import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from 'src/app/services/modal.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public formRegister: FormGroup = new FormGroup({
    name: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(''),
    repassword: new FormControl(''),
  });
  public isLoading: boolean = false;
  public userExist: boolean | undefined;
  
  isOpenModal = signal(false);

  modalService = inject(ModalService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.formRegister = this.fb.group(
      {
        name: ['123', Validators.required],
        email: [
          'matias.sanchez.12@gmail.com',
          [Validators.email, this.spacesValidator],
        ],
        password: ['123123', Validators.required],
        repassword: ['123123', Validators.required],
      },
      { validator: this.ConfirmedValidator('password', 'repassword') }
    );
  }

  constructor(private fb: FormBuilder) {
    this.modalService.watch().subscribe((data) => {
      const isOpen = data.state === 'open' && data.type === 'register';
      this.isOpenModal.set(isOpen);
    })
  }

  async onSubmit() {
    if (!this.formRegister.invalid) {
      this.isLoading = true;
      const { email, password, name } = this.formRegister.value;

      this.authService
        .signUp(email, password, name)
        .then(() => {
          console.log(123)
          alert('creado')
          // this.toastr.success('Usuario creado con exito!');
          // this.handleCloseModal()
        })
        .catch((error: any) => {
          let messageError = error;
          if (error.code === 'auth/email-already-in-use') {
            messageError = 'El email ya esta en uso';
          }
          console.log(error)

          // this.toastr.error(messageError);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  handleCloseModal() {
    this.modalService.close('register')
  }

  handleOpenModal() {
    this.modalService.close('register')
    this.modalService.open('login')
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
