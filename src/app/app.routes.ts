import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AddWorkoutComponent } from './add-workout/add-workout.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home page'
    },
    {
        path: 'add',
        component: AddWorkoutComponent,
        title: 'New Workout'
    }
];
