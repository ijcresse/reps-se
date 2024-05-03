import { 
  Component, 
  Input,
  AfterViewInit,
  QueryList,
  ViewChildren
} from '@angular/core';
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

  // @ViewChildren(WorkoutInstanceComponent) instanceComponents!: QueryList<WorkoutInstanceComponent>;

  //initially empty - workouts don't get color until they're performed.
  panelColor: string = "";
  userPath: string = "";

  ngOnInit() {
    this.userPath = `${this.workoutPath}/${this.workout.workoutId}/Users`;
  }

  //assembles data for add-route
  // getWorkoutData() {

  //   this.fetchDataFromInstance();
  // }

  // fetchDataFromInstance() {
  //   for (let i = 0; i < this.instanceComponents.length; i++) {
  //     this.instanceComponents.get(i).getInstanceData();
  //   }
  // }
}