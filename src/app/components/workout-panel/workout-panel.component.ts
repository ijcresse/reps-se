import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentData } from 'firebase/firestore';

import { MatExpansionModule } from '@angular/material/expansion';

import { Workout } from '../../workout.interface';
import { WorkoutInstanceComponent } from '../workout-instance/workout-instance.component';

//simple containing expansionpanel for individual workout instances within.
@Component({
  selector: 'app-workout-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    WorkoutInstanceComponent
  ],
  templateUrl: './workout-panel.component.html',
  styleUrl: './workout-panel.component.scss'
})
export class WorkoutPanelComponent {
  @Input() workout!: Workout;
  @Input() workoutPath!: string;  
  @Input() index!: number;

  userPath: string = "";

  ngOnInit() {
    this.userPath = `${this.workoutPath}/${this.workout.workoutId}/Users`;
  }
}

/*
adding workout: WorkoutTemplates/ChestDay/Workouts/Incline Press 
Object { id: "Incline Press", date: {…}, displayName: "Incline Press", type: 1 }
​
date: Object { _methodName: "serverTimestamp" }
​
displayName: "Incline Press"
​
id: "Incline Press"
​
type: 1
​
<prototype>: Object { … }
*/