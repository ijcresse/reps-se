import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  email: string = "";
  password: string = "";

  constructor(private _snackBar: MatSnackBar) {
    
  }

  logIn() {
    this.authService.signIn(this.email, this.password);
    this.email = "";
    this.password = "";
  }

  logOut() {
    this.authService.logOut();
    this._snackBar.open("Logged out.", "OK");
  }

  guestAccess() {
    this.authService.homeRedirect();
  }
}
