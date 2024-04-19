import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { DocumentData, DocumentReference, serverTimestamp } from 'firebase/firestore';

import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { Util } from '../../util';
import { Workout } from '../../workout.interface';
import { WorkoutInstanceComponent } from '../workout-instance/workout-instance.component';

@Component({
  selector: 'app-add-workout-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    FormsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    WorkoutInstanceComponent
  ],
  templateUrl: './add-workout-panel.component.html',
  styleUrl: './add-workout-panel.component.scss'
})
export class AddWorkoutPanelComponent {
  @Input() templateId!: string;
  @Output() addWorkoutEvent = new EventEmitter<Workout>();
  db: Firestore = inject(Firestore);

  workoutName: string = "";
  workoutType = [ 
    { value: 0, name: 'aerobic' },
    { value: 1, name: 'anaerobic' }
  ]
  selectedType = this.workoutType[0];

  async addWorkout() {
    const workoutId = Util.pascalCase(this.workoutName);
    const path = `WorkoutTemplates/${this.templateId}/Workouts/${workoutId}`;
    const workoutDocRef: DocumentReference = doc(this.db, path);
    const workoutDoc: DocumentData = {
      id: workoutId,
      date: serverTimestamp(),
      displayName: this.workoutName,
      type: this.selectedType
    };
    const newWorkout: Workout = {
      workoutId: workoutId,
      workoutData: workoutDoc,
      instanceData: []
    }
    await setDoc(workoutDocRef, workoutDoc)
      .then(() => {
        this.addWorkoutEvent.emit(newWorkout)
        //set up Users for the new workout
        this.addUsersToWorkout(path);
      });
  }

  async addUsersToWorkout(workoutPath: string) {
    const userDoc: DocumentData = {
      latestDate: serverTimestamp()
    };
    await setDoc(doc(this.db, `${workoutPath}/Users/Ian`), userDoc);
    await setDoc(doc(this.db, `${workoutPath}/Users/Holly`), userDoc);
  }
}
