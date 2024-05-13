import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AddRouteComponent } from './add-route/add-route.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        title: 'Home page'
    },
    {
        path: 'add',
        component: AddRouteComponent,
        title: 'New Workout'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Log In'
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];
