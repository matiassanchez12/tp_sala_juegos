import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap, of } from 'rxjs';
import { IUser } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  async signUp(email: string, password: string, name: string) {
    const emailIsUsed = await this.checkEmailInUse(email);

    if (emailIsUsed) {
      throw new Error('El correo ya esta en uso');
    }

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

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          const { uid, email } = user;

          return this.firestore.collection<IUser>('users').doc(uid).valueChanges().pipe(
            switchMap(userData => {
              // Retornar un objeto que contenga los datos del usuario y su email
              return of({ ...userData, email });
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  checkEmailInUse(email: string): Promise<boolean> {
    return this.afAuth.fetchSignInMethodsForEmail(email)
      .then(providers => {
        return providers.length > 0;
      })
      .catch(error => {
        console.log('Error al verificar el correo electrónico:', error);
        return false;
      });
  }
}
