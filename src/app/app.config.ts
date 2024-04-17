import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"reps-se","appId":"1:588742206464:web:57ef087666f7b5486a24e5","storageBucket":"reps-se.appspot.com","apiKey":"AIzaSyBt5bG7yX5UmNc4qmFRWtSGnH_yXz42bO8","authDomain":"reps-se.firebaseapp.com","messagingSenderId":"588742206464"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
