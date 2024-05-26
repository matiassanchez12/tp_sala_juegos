import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap, of } from 'rxjs';
import { IUser } from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userLoggedIn = signal<IUser | null>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
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

  async signIn(email: string, password: string) {
    const user = await this.afAuth.signInWithEmailAndPassword(email, password);

    const id = this.firestore.createId();

    await this.firestore
      .collection('logs_login')
      .doc(id)
      .set({ user_id: user.user?.uid, date: new Date() });

    await this.firestore
      .collection('online')
      .doc(user.user?.uid)
      .set({ user_id: user.user?.uid, date: new Date(), online: true });

    return user;
  }

  async signOut() {
    const user = await this.afAuth.currentUser;

    await this.firestore
      .collection('online')
      .doc(user?.uid)
      .set({ user_id: user?.uid, date: new Date(), online: false });

    this.router.navigate(['/home']);

    return this.afAuth.signOut();
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const { uid, email } = user;

          return this.firestore
            .collection<IUser>('users')
            .doc(uid)
            .valueChanges()
            .pipe(
              switchMap((userData) => {
                if (userData) {
                  this.userLoggedIn.set({ ...userData, email: email! });
                }

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
    return this.afAuth
      .fetchSignInMethodsForEmail(email)
      .then((providers) => {
        return providers.length > 0;
      })
      .catch((error) => {
        console.log('Error al verificar el correo electrónico:', error);
        return false;
      });
  }
}
