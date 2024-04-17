import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideFirestore(() => getFirestore()),
    ])
  ]
};
