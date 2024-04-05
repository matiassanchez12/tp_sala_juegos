import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  signUp(email: string, password: string, name: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential: firebase.default.auth.UserCredential) => {
        const userId = userCredential.user!.uid;

        this.firestore.collection('users').doc(userId).set({
          id: userId,
          password,
          name,
          timestamp: new Date(),
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.afAuth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.authState;
  }
}
