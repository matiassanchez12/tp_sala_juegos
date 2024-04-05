import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
  ],
};
