import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IChatMessage } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore = inject(AngularFirestore);

  public createMessage(
    message: string,
    receiver_id: string,
    sender_id: string
  ) {
    const id = this.firestore.createId();

    return this.firestore.collection('chat_messages').doc(id).set({
      id,
      content: message,
      receiver_id,
      sender_id,
      timestamp: new Date(),
    });
  }

  public getAllMessages() {
    const chatCollection = this.firestore.collection<IChatMessage>(
      'chat_messages',
      (ref) =>
        ref.orderBy('timestamp')
    );

    return chatCollection.valueChanges();
  }
}
