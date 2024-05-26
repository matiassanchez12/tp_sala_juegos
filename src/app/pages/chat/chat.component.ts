import {
  Component,
  signal,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { IChatMessage, IUser } from 'src/app/interfaces';
import { UserService } from 'src/app/services/user.service';
import { timePipe } from 'src/app/pipes/time.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, timePipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  chatUsers = signal<IUser[]>([]);
  userLoggedIn = signal<IUser| null>(
    null
  );
  messages = signal<IChatMessage[]>([]);

  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  private userService = inject(UserService);

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  ngOnInit(): void {
    this.userLoggedIn.set(this.authService.userLoggedIn());

    this.userService.getUsersOnline().subscribe((users) => {
      
      this.userService.getAllUsers().subscribe((allUsers) => {
        const newArrayUsers = allUsers?.filter(user => users.some(u => u.user_id === user.id));
        
        this.chatUsers.set(newArrayUsers);

        this.loadMessages(allUsers!);
      })
    });
  }

  public loadMessages(users: IUser[]) {
    this.chatService.getAllMessages().subscribe((messages) => {
      const formatedMessages = messages.map((message) => {
        const sender = users.find((user) => user.id === message.sender_id)!;
        const receiver = users.find((user) => user.id === message.receiver_id)!;

        return {
          ...message,
          sender_user: sender,
          receiver_user: receiver,
        };
      });

      this.messages.set(formatedMessages);

      setTimeout(() => {
        this.scrollToBottom();
      }, 200);
    });
  }

  formSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const textArea = form.elements.namedItem('comment') as HTMLTextAreaElement;
    const commentText = textArea.value;

    this.chatService.createMessage(
      commentText,
      this.userLoggedIn()!.id!,
      this.userLoggedIn()!.id!
    );

    form.reset();
  }

  private scrollToBottom() {
    const container = this.chatContainer.nativeElement;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }
}
