import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from 'src/app/services/modal.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  errorEmailUsed = signal(false);

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

  constructor(private fb: FormBuilder, public toastrService: ToastrService) {
    this.modalService.watch().subscribe((data) => {
      const isOpen = data.state === 'open' && data.type === 'register';
      this.isOpenModal.set(isOpen);
    })
  }

  async onSubmit() {
    if (!this.formRegister.invalid) {
      this.isLoading = true;
      const { email, password, name } = this.formRegister.value;

      this.modalService.open('loader');

      this.authService
        .signUp(email, password, name)
        .then(() => {
          this.toastrService.success('Usuario creado con exito!', undefined, {positionClass: 'toast-top-center'});
          
          this.authService.signIn(email, password).then(() => {
            this.handleCloseModal();
          })
        })
        .catch((error: any) => {
          this.errorEmailUsed.set(true);
          this.toastrService.error(error.message);
        })
        .finally(() => {
          this.modalService.close('loader');
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
