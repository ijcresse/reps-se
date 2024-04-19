import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentData } from 'firebase/firestore';

import { MatExpansionModule } from '@angular/material/expansion';
import { Workout } from '../../workout.interface';

@Component({
  selector: 'app-workout-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule
  ],
  templateUrl: './workout-panel.component.html',
  styleUrl: './workout-panel.component.scss'
})
export class WorkoutPanelComponent {
  @Input() workout!: Workout;
  @Input() index!: number;

  ngOnInit() {
    console.log('workoutpanel#', this.index, this.workout);
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