import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IUser, IUserScore } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(AngularFirestore);

  public getAllUsers() {
    const chatCollection = this.firestore.collection<IUser>('users', (ref) =>
      ref.orderBy('timestamp')
    );

    return chatCollection.valueChanges();
  }

  public getUsersOnline(): Observable<any[]> {
    const onlineQuery = this.firestore.collection('online', (ref) =>
      ref.where('online', '==', true)
    );

    return onlineQuery.valueChanges();
  }

  public async saveUserScore(user: IUser, score: number, game: string) {
    const id = this.firestore.createId();

    let maxScore = 0;

    this.firestore
      .collection<IUserScore>('score', (ref) => ref.where('game', '==', game))
      .get()
      .forEach((querySnapshot) => {
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            const scoreData = doc.data();

            if (scoreData.score > maxScore) {
              maxScore = scoreData.score;
            }
          });
          if (score >= maxScore) {
            this.firestore.collection('score').doc(`${user.id}-${game}`).set({
              id,
              user,
              score,
              game,
              timestamp: new Date(),
            });
          }
        }
      });
  }

  public getBestScoreByGame(game: string): Observable<any[]> {
    const scoreQuery = this.firestore.collection('score', (ref) =>
      ref.where('game', '==', game).orderBy('score', 'desc').limit(1)
    );

    return scoreQuery.valueChanges();
  }

  public getListScoresByGame(game: string) {
    const scoreQuery = this.firestore.collection<IUserScore>('score', (ref) =>
      ref.where('game', '==', game).orderBy('score', 'desc')
    );

    return scoreQuery.valueChanges();
  }
}
