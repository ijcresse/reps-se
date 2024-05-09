import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentData, serverTimestamp } from 'firebase/firestore';

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
import { FirestoreService } from '../../firestore.service';

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
  db: FirestoreService = inject(FirestoreService);

  workoutName: string = "";
  workoutType = [ 
    { value: 0, name: 'aerobic' },
    { value: 1, name: 'anaerobic' }
  ]
  selectedType = this.workoutType[0].value;

  async addWorkout() {
    const workoutId = Util.pascalCase(this.workoutName);
    const path = `WorkoutTemplates/${this.templateId}/Workouts/${workoutId}`;
    const ref = this.db.getRefFromDocPath(path);
    const doc: Workout = {
      id: workoutId,
      path: path,
      displayName: this.workoutName,
      type: this.selectedType
    };
    this.db.setDoc(ref, doc)
    .then(() => {
      this.addWorkoutEvent.emit(doc)
      this.addUsersToWorkout(path);
    });
  }

  async addUsersToWorkout(workoutPath: string) {
    const userDoc: DocumentData = {
      date: serverTimestamp()
    };
    //TODO: fetch this from db
    const users = ['Ian', 'Holly'];
    for (let i = 0; i < users.length; i++) {
      const ref = this.db.getRefFromDocPath(`${workoutPath}/Users/${users[i]}`);
      await this.db.setDoc(ref, userDoc);
    }
  }
}
