import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection } from '@angular/fire/firestore';
import { doc, getDocs, query, serverTimestamp, setDoc } from 'firebase/firestore';

import { AddWorkoutPanelComponent } from '../components/add-workout-panel/add-workout-panel.component';
import { WorkoutPanelComponent } from '../components/workout-panel/workout-panel.component';
import { Workout } from '../workout.interface';
import { Util } from '../util';

@Component({
  selector: 'app-add-route',
  standalone: true,
  imports: [
    CommonModule,
    AddWorkoutPanelComponent,
    WorkoutPanelComponent
  ],
  templateUrl: './add-route.component.html',
  styleUrl: './add-route.component.scss'
})
export class AddRouteComponent {
  db: Firestore = inject(Firestore);
  isExistingTemplate!: boolean;
  templateDoc;
  templateName;
  workoutPath: string = "";

  workouts$: Workout[] = [];

  constructor() { 
    this.isExistingTemplate = history.state.isExistingTemplate;
    if (this.isExistingTemplate) {
      this.templateDoc = history.state.templateDoc;
      this.templateName = this.templateDoc.displayName;
    } else {
      this.templateName = history.state.templateName;
    }
    //throw error and redirect to error page if templateId isn't there.
  }

  //TODO: re-engineer this. even with isExistingTemplate, this feels a little hacky
  async ngOnInit() {
    if (!this.isExistingTemplate) {
      this.createNewTemplate();
    } else {
      this.workoutPath = `WorkoutTemplates/${this.templateDoc.id}/Workouts`;
      const workoutCollection = collection(this.db, this.workoutPath);
      const workoutQuery = query(workoutCollection);
      const workoutSnapshot = await getDocs(workoutQuery);
      workoutSnapshot.forEach((doc) => {
        this.workouts$.push({
          workoutId: doc.id,
          workoutData: doc.data(),
          instanceData: []
        })
      })
      console.log(this.workouts$);
    }
  }

  //performed here because user has committed to a new page
  async createNewTemplate() {
    const templateId: string = Util.pascalCase(this.templateName);
    const templateDocRef = doc(this.db, "WorkoutTemplates", templateId);
    const templateDoc = {
      displayName: this.templateName,
      color: "tbd",
      latestWorkout: serverTimestamp()
    }
    await setDoc(templateDocRef, templateDoc)
      .then(() => {
        this.templateDoc = templateDoc
        this.templateDoc.id = templateId;
        this.workoutPath = `WorkoutTemplates/${templateId}/Workouts`;
      });
  }

  addWorkout(workout: Workout) {
    this.workouts$.push(workout);
    console.log('added new workout', this.workouts$);
  }
}
