import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { IChatMessage } from 'src/app/interfaces';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  userLoggedIn = signal<{name: string, id: string, email: string} | null>(null);
  messages = signal<IChatMessage[]>([]);
  private authService = inject(AuthService);
  private chatService = inject(ChatService);

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userLoggedIn.set({name: user.name, id: user.id, email: user.email});

        this.loadMessages();
      } else {
        this.userLoggedIn.set(null);
      }
    })
  }

  public loadMessages() {
    this.chatService.getAllMessages().subscribe((messages) => {
      this.messages.set(messages);
    })
  }

  formSubmit(event: SubmitEvent){
    event.preventDefault()

    const form = event.target as HTMLFormElement;
    const textArea = form.elements.namedItem('comment') as HTMLTextAreaElement;
    const commentText = textArea.value;

    this.chatService.createMessage(commentText, this.userLoggedIn()!.id!, this.userLoggedIn()!.id!);

    form.reset();
  }
}
