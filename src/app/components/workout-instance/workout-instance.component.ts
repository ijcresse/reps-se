import { Component, Input } from '@angular/core';
import { DocumentReference } from 'firebase/firestore';

@Component({
  selector: 'app-workout-instance',
  standalone: true,
  imports: [],
  templateUrl: './workout-instance.component.html',
  styleUrl: './workout-instance.component.scss'
})
export class WorkoutInstanceComponent {
  @Input() workoutPath!: string;

}
