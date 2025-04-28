import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      projectId: "webkert-project-17183",
      appId: "1:946778808710:web:5c98eed266136412db4c07",
      storageBucket: "webkert-project-17183.firebasestorage.app",
      apiKey: "AIzaSyCqlVHYfNtEhGWDguF5SYS_bc7VCsLrU1A",
      authDomain: "webkert-project-17183.firebaseapp.com",
      messagingSenderId: "946778808710" })),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
    ]
};
