import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

interface SnakePart {
  x: number;
  y: number;
}

@Component({
  selector: 'app-snake',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'],
})
export class SnakeComponent implements OnInit {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef;
  context!: CanvasRenderingContext2D;
  blockSize = 20;
  canvasWidth = 600;
  canvasHeight = 400;
  snake: SnakePart[] = [{ x: 10, y: 10 }];
  food: SnakePart = { x: 0, y: 0 };
  direction: Direction = Direction.Right;
  gameInterval: any;
  isFirstGame: boolean = true;

  toastrService = inject(ToastrService);

  ngOnInit() {
    this.context = (
      this.canvasRef.nativeElement as HTMLCanvasElement
    ).getContext('2d') as CanvasRenderingContext2D;
    window.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  startGame() {
    if (this.isFirstGame) {
      this.placeFood();
      this.gameInterval = setInterval(() => this.gameLoop(), 100);
      this.isFirstGame = false;
      return;
    }

    this.toastrService.clear();
    clearInterval(this.gameInterval);

    this.snake = [{ x: 10, y: 10 }];
    this.direction = Direction.Right;
    this.placeFood();
    this.gameInterval = setInterval(() => this.gameLoop(), 100);
  }

  gameLoop() {
    this.moveSnake();
    this.checkCollision();
    this.draw();
  }

  draw() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    var img = new Image();

    img.src = '/assets/kiwi.png';

    this.context.drawImage(
      img,
      this.food.x * this.blockSize,
      this.food.y * this.blockSize,
      22,
      22
    );

    // Draw snake
    this.context.fillStyle = 'green';
    this.snake.forEach((part) => {
      this.context.fillRect(
        part.x * this.blockSize,
        part.y * this.blockSize,
        this.blockSize,
        this.blockSize
      );
    });
  }

  moveSnake() {
    const newHead = { ...this.snake[0] };

    switch (this.direction) {
      case Direction.Up:
        newHead.y--;
        break;
      case Direction.Down:
        newHead.y++;
        break;
      case Direction.Left:
        newHead.x--;
        break;
      case Direction.Right:
        newHead.x++;
        break;
    }

    this.snake.unshift(newHead);

    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.placeFood();
    } else {
      this.snake.pop();
    }
  }

  placeFood() {
    this.food.x = Math.floor(
      Math.random() * (this.canvasWidth / this.blockSize)
    );
    this.food.y = Math.floor(
      Math.random() * (this.canvasHeight / this.blockSize)
    );
  }

  checkCollision() {
    const head = this.snake[0];

    if (
      head.x < 0 ||
      head.x >= this.canvasWidth / this.blockSize ||
      head.y < 0 ||
      head.y >= this.canvasHeight / this.blockSize
    ) {
      clearInterval(this.gameInterval);

      this.toastrService.warning('Game Over!', undefined, {
        positionClass: 'toast-center-center',
      });

      this.food.x = 0;
      this.food.y = 0;
    }
    
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        clearInterval(this.gameInterval);
        this.food.x = 0;
        this.food.y = 0;

        this.toastrService.warning('Game Over!', undefined, {
          positionClass: 'toast-center-center',
        });
        break;
      }
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction !== Direction.Down) {
          this.direction = Direction.Up;
        }
        break;
      case 'ArrowDown':
        if (this.direction !== Direction.Up) {
          this.direction = Direction.Down;
        }
        break;
      case 'ArrowLeft':
        if (this.direction !== Direction.Right) {
          this.direction = Direction.Left;
        }
        break;
      case 'ArrowRight':
        if (this.direction !== Direction.Left) {
          this.direction = Direction.Right;
        }
        break;
    }
  }
}
