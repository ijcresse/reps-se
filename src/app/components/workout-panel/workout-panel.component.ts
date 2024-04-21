import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  @Input() templateColor!: string;
  @Input() index!: number;

  //initially empty - workouts don't get color until they're performed.
  panelColor: string = "";
  userPath: string = "";

  ngOnInit() {
    this.userPath = `${this.workoutPath}/${this.workout.workoutId}/Users`;
  }
}