import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
    canActivate: [authGuard],
  },
  {
    path: 'games',
    loadComponent: () =>
      import('./pages/games/games.component').then((m) => m.GamesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'games/snake',
    loadComponent: () =>
      import('./pages/games/snake/snake.component').then((m) => m.SnakeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'games/ahorcado',
    loadComponent: () =>
      import('./pages/games/ahorcado/ahorcado.component').then((m) => m.AhorcadoComponent),
    canActivate: [authGuard],
  },
  {
    path: 'games/preguntados',
    loadComponent: () =>
      import('./pages/games/preguntados/preguntados.component').then((m) => m.PreguntadosComponent),
    canActivate: [authGuard],
  },
  {
    path: 'games/mayor-menor',
    loadComponent: () =>
      import('./pages/games/mayormenor/mayormenor.component').then((m) => m.MayormenorComponent),
    canActivate: [authGuard],
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat.component').then((m) => m.ChatComponent),
    canActivate: [authGuard],
  },
];
