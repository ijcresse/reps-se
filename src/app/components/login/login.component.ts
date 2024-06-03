import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../auth.service';

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

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.homeRedirect();
    }
  }

  logIn() {
    this.authService.signIn(this.email, this.password);
    this.email = "";
    this.password = "";
  }

  guestAccess() {
    this.authService.homeRedirect();
  }
}
