import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { DocumentReference, serverTimestamp } from 'firebase/firestore';

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
  db: Firestore = inject(Firestore);
  workoutName: string = "";
  workoutType = [ 
    { value: 0, name: 'aerobic' },
    { value: 1, name: 'anaerobic' }
  ]
  selectedType = this.workoutType[0];
  workoutPath: string = "";
  //move to instance
  // activeTab = new FormControl(0);

  //TODO: these should be classes with converters
  //note: these are for the instance of the workout. move there.
  aerobic = {
    'hours': 0,
    'minutes': 0,
    'notes': ""
  }
  anaerobic = {
    sets: 0,
    reps: 0,
    weight: 0
  }

  async addWorkout() {
    const path = `WorkoutTemplates/${this.templateId}/Workouts/${Util.pascalCase(this.workoutName)}`;
    const workoutDocRef: DocumentReference = doc(this.db, path);
    let workoutDoc = {
      date: serverTimestamp(),
      displayName: this.workoutName,
      type: ''
    };
    console.log(path);
    //move to instance
    // if (this.activeTab.value === 0) {
    //   workoutDoc.type = 'aerobic'
    // } else {
    //   workoutDoc.type = 'anaerobic'
    // }
    await setDoc(workoutDocRef, workoutDoc)
      .then(() => {
        this.workoutPath = path;
      });
    //TODO: somehow signal to add-route to insert new doc into the list.
  }
}
