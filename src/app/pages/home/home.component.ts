import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { IUser, IUserScore } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  activeTab = signal('ahorcado');
  userLoggedIn = signal<IUser | null>(null);
  listOfAhorcado = signal<IUserScore[] | null>(null);
  listOfMayormenor = signal<IUserScore[] | null>(null);
  listOfSnake = signal<IUserScore[] | null>(null);
  listOfPreguntados = signal<IUserScore[] | null>(null);

  modalService = inject(ModalService);
  authService = inject(AuthService);
  userService = inject(UserService);

  onTabClick = (tab: string) => {
    this.activeTab.set(tab);
  };

  ngOnInit(): void {
    this.userService.getListScoresByGame('ahorcado').subscribe((scores) => {
      this.listOfAhorcado.set(scores);
    });
    this.userService.getListScoresByGame('mayormenor').subscribe((scores) => {
      this.listOfMayormenor.set(scores);
    });
    this.userService.getListScoresByGame('preguntados').subscribe((scores) => {
      this.listOfPreguntados.set(scores);
    });
    this.userService.getListScoresByGame('snake').subscribe((scores) => {
      this.listOfSnake.set(scores);
    });

    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userLoggedIn.set(user);
      } else {
        this.userLoggedIn.set(null);
      }
    });
  }

  handleOpenModal() {
    this.modalService.open('login');
  }
}
