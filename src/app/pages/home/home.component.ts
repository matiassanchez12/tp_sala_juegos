import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  activeTab = signal('ahorcado');
  userLoggedIn = signal<{name: string, id: string, email: string} | null>(null);

  authService = inject(AuthService);

  onTabClick = (tab: string) => {
    this.activeTab.set(tab);
  };

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userLoggedIn.set({name: user.name, id: user.id, email: user.email});
      } else {
        this.userLoggedIn.set(null);
      }
    })
  }
}
