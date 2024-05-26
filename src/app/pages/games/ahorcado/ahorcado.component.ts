import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { IUser, IUserScore } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss'],
})
export class AhorcadoComponent {
  public letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'Ñ',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  public words =  [
    "elefante",
    "jirafa",
    "piña",
    "canguro",
    "cuaderno",
    "montaña",
    "arcoiris",
    "pingüino",
    "sándwich",
    "mochila",
    "girasol",
    "cascada",
    "globo",
    "chocolate",
    "diamante",
    "huracán",
    "festival",
    "universo",
    "faro",
    "paraíso"
  ];

  currentUser = signal<IUser | null>(null);
  completeWord = signal('');
  tryAgain = signal(false);
  currentWord = signal(['']);
  manImage = signal(0);
  score = signal(0);
  bestScore = signal(0);

  toastrService = inject(ToastrService);
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    // Suscribirse al evento keyup del documento
    document.addEventListener('keyup', this.keyPressed.bind(this));

    this.userService.getBestScoreByGame('ahorcado').subscribe(score => {
      this.bestScore.set((score[0] as IUserScore).score);
    })

    this.generateWord();
  }

  // Método para manejar el evento de teclado
  keyPressed(event: KeyboardEvent) {
    if(this.tryAgain()) return; 

    const key = event.key.toLowerCase();

    this.checkKeyPressed(key);
  }

  handleBack() {
    this.router.navigate(['/games']);
  }

  generateWord() {
    this.currentWord.set(['']);
    this.manImage.set(1);
    this.tryAgain.set(false)

    const randomWord =
      this.words[Math.floor(Math.random() * this.words.length)];
    const randomLetterOne = Math.floor(Math.random() * randomWord.length);
    const randomLetterTwo = Math.floor(Math.random() * randomWord.length);

    const wordToShow = Array(randomWord.length).fill('');

    wordToShow[randomLetterOne] = randomWord[randomLetterOne];
    wordToShow[randomLetterTwo] = randomWord[randomLetterTwo];

    this.completeWord.set(randomWord);
    this.currentWord.set(wordToShow);
  }

  checkWin() {
    if (this.currentWord().join('') === this.completeWord()) {
      this.toastrService.success('Genial, adivinaste', undefined, {
        positionClass: 'toast-center-center',
      });
      
      const newScore = this.score() + 1;

      this.userService.saveUserScore(this.authService.userLoggedIn()!, newScore, 'ahorcado');

      this.score.set(newScore);
      
      this.generateWord();
    }
  }

  checkKeyPressed(key: string) {
    if (this.completeWord().split('').includes(key)) {
      let equalKeys = 0;

      this.completeWord()
        .split('')
        .forEach((letter) => {
          if (letter === key) {
            equalKeys++;
          }
        });

      if (equalKeys > 1) {
        this.completeWord()
          .split('')
          .forEach((letter, index) => {
            if (letter === key) {
              const newWord = this.currentWord().map((letter, i) => {
                if (i === index) {
                  return key;
                }

                return letter;
              });

              this.currentWord.set(newWord);
            }
          });

        this.checkWin();
        return;
      }

      if (this.currentWord().includes(key)) {
        return;
      }

      const indexCorrectKey = this.completeWord()
        .split('')
        .findIndex((v) => v === key);

      const newWord = this.currentWord().map((letter, i) => {
        if (i === indexCorrectKey) {
          return key;
        }
        return letter;
      });

      this.currentWord.set(newWord);

      this.checkWin();
    } else {
      this.changeManImage(key);
    }
  }

  changeManImage(key: string) {
    if (!this.letters.includes(key.toUpperCase())) {
      return;
    }

    if (this.manImage() === 6) {
      this.manImage.set(0);

      this.toastrService.error('Perdiste', undefined, {
        positionClass: 'toast-center-center',
      });
      this.tryAgain.set(true)
      this.currentWord.set([]);
      this.score.set(0);
    }

    this.manImage.update((value) => value + 1);
  }
}
