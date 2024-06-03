import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { HomeComponent } from './home/home.component';
import { AddRouteComponent } from './add-route/add-route.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HomeComponent,
    AddRouteComponent,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authService: AuthService = inject(AuthService);
  title: string = 'Reps.';
  authorized: boolean = false;
  
  constructor() {
    this.authorized = this.authService.isAuthenticated();
  }
}