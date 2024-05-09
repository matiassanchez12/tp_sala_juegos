import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IUser } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(AngularFirestore);
  private db = inject(AngularFireDatabase);

  public getAllUsers() {
    const chatCollection = this.firestore.collection<IUser>('users', (ref) =>
      ref.orderBy('timestamp')
    );

    return chatCollection.valueChanges();
  }

  getUsersOnline(): Observable<any[]> {
    const onlineCollection = this.firestore.collection('online', (ref) =>
      ref.where('online', '==', true)
    );

    return onlineCollection.valueChanges();
  }
}
