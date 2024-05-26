import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IUserScore } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

interface Card {
  value: string;
  suit: string;
}

@Component({
  selector: 'app-mayormenor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mayormenor.component.html',
  styleUrls: ['./mayormenor.component.scss'],
})
export class MayormenorComponent {
  allCards: Card[] = [];
  shuffledCards: Card[] = [];
  currentIndex: number = 0;
  currentCards: Card[] | null = null;

  bestScore = signal(0);
  score = signal(0);
  showSecondCard = signal(false);
  isCorrectAnswer = signal(false);

  router = inject(Router);
  userService = inject(UserService);
  authService = inject(AuthService);

  ngOnInit() {
    this.generateCards();
    this.shuffleCards();
    this.showNextCards();

    this.userService.getBestScoreByGame('mayormenor').subscribe((score) => {
      this.bestScore.set((score[0] as IUserScore).score);
    });
  }

  generateCards() {
    const suits = ['diamonds'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];

    this.allCards = [];
    for (const suit of suits) {
      for (const value of values) {
        this.allCards.push({ value, suit });
      }
    }
  }

  handleClick(selection: string) {
    this.showSecondCard.set(true);
    this.isCorrectAnswer.set(false);

    if (selection === 'mayor') {
      if (
        Number(this.currentCards![0].value) >
        Number(this.currentCards![1].value)
      ) {
        this.isCorrectAnswer.set(true);

        const newScore = this.score() + 1;

        this.userService.saveUserScore(this.authService.userLoggedIn()!, newScore, 'mayormenor');

        this.score.set(newScore);
      }
    } else {
      if (
        Number(this.currentCards![0].value) <
        Number(this.currentCards![1].value)
      ) {
        this.isCorrectAnswer.set(true);

        const newScore = this.score() + 1;

        this.userService.saveUserScore(this.authService.userLoggedIn()!, newScore, 'mayormenor');

        this.score.set(newScore);
      }
    }
  }

  handleBack() {
    this.router.navigate(['/games']);
  }

  shuffleCards() {
    this.shuffledCards = [...this.allCards];
    for (let i = this.shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledCards[i], this.shuffledCards[j]] = [
        this.shuffledCards[j],
        this.shuffledCards[i],
      ];
    }
  }

  showNextCards() {
    this.currentCards = [];
    this.showSecondCard.set(false);

    if (this.currentIndex < this.shuffledCards.length) {
      this.currentCards.push(this.shuffledCards[this.currentIndex]);
      this.currentIndex++;
    }

    if (this.currentIndex < this.shuffledCards.length) {
      this.currentCards.push(this.shuffledCards[this.currentIndex]);
      this.currentIndex++;
    }
  }

  getImagePathOne() {
    return (
      '/assets/cards/' +
      this.currentCards![0].value +
      '_of_' +
      this.currentCards![0].suit +
      '.png'
    );
  }

  getImagePathTwo() {
    return (
      '/assets/cards/' +
      this.currentCards![1].value +
      '_of_' +
      this.currentCards![1].suit +
      '.png'
    );
  }
}
