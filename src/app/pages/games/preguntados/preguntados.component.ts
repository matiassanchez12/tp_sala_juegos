import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PreguntadosService } from 'src/app/services/api/preguntados.service';
import { Category, IQuestion, IUserScore } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss'],
})
export class PreguntadosComponent {
  categories = signal<Category[]>([]);
  questions = signal<IQuestion[]>([]);

  selectedCategory = signal('');
  selectedOption = signal<string | null>(null);
  bestScore = signal(0);
  score = signal(0);
  indexQuestion = signal(0);
  question = signal<IQuestion | null>(null);
  isLoading = signal<boolean>(false);

  router = inject(Router);
  preguntadosService = inject(PreguntadosService);
  userService = inject(UserService);
  authService = inject(AuthService);

  ngOnInit() {
    this.preguntadosService.getCategories().subscribe(({ categories }) => {
      this.categories.set(categories.slice(0, 7));
    });

    this.userService.getBestScoreByGame('preguntados').subscribe((score) => {
      this.bestScore.set((score[0] as IUserScore).score);
    });
  }

  getBgColorByCard(category: string) {
    switch (category) {
      case 'css':
        return 'bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800';
      case 'javascript':
        return ' bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800';
      case 'cpp':
        return 'bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800';
      case 'html':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800';
      case 'java':
        return 'bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800';
      case 'csharp':
        return 'text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700';
      default:
        return 'text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg';
    }
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);

    this.isLoading.set(true);

    this.preguntadosService.getQuestions(category).subscribe((questions) => {
      this.questions.set(questions);
      this.isLoading.set(false);
      this.generateQuestion(true);
    });
  }

  handleBack() {
    if (this.selectedCategory().length > 0) {
      this.selectedCategory.set('');
      return;
    }

    this.router.navigate(['/games']);
  }

  generateQuestion(first?: boolean) {
    this.selectedOption.set(null);

    const currentIndex = first ? 0 : this.indexQuestion() + 1;

    this.indexQuestion.set(currentIndex);

    this.question.set(this.questions()[currentIndex]);
  }

  handleClickOption(option: string) {
    if (this.selectedOption()) return;

    this.selectedOption.set(option);

    if (option === this.question()?.correct_answer) {
      const newScore = this.score() + 1;

      this.userService.saveUserScore(this.authService.userLoggedIn()!, newScore, 'preguntados');

      this.score.set(newScore);
    }
  }

  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
