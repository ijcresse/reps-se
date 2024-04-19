import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AddRouteComponent } from './add-route/add-route.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home page'
    },
    {
        path: 'add',
        component: AddRouteComponent,
        title: 'New Workout'
    }
];
