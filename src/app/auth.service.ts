import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor(private router: Router) { }

  async signIn(email:string, password: string) {
    console.log('login attempt with', email, password);
    signInWithEmailAndPassword(this.auth, email, password)
    .then(() => {
      this.router.navigateByUrl('/home');
    })
    .catch((error) => {
      console.log("Login error:", error.code, error.message);
      //TODO: open snackbar
    })
  }

  isAuthenticated() {
    return this.auth.currentUser !== null;
  }

  loginRedirect() {
    this.router.navigateByUrl('/login');
  }

  homeRedirect() {
    this.router.navigateByUrl('/home');
  }
}
