import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor(private router: Router) { }

  async signIn(email:string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
    .then(() => {
      console.log(this.auth.currentUser);
      this.router.navigateByUrl('/home');
    })
    .catch((error) => {
      console.log("Login error:", error.code, error.message);
      //TODO: open snackbar
    })
  }

  async logOut() {
    signOut(this.auth)
    .then(() => {
      //TODO: open snackbar
    })
    .catch((error) => {
      console.log("Log out error:", error.code, error.message);
    });
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
