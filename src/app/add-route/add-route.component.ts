import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection } from '@angular/fire/firestore';
import { DocumentData, doc, getDocs, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { AddWorkoutPanelComponent } from '../components/add-workout-panel/add-workout-panel.component';
import { WorkoutPanelComponent } from '../components/workout-panel/workout-panel.component';
import { Workout, UserPerformance, HistoryInstance } from '../workout.interface';
import { Util } from '../util';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-route',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
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
  historyDocs: HistoryInstance[] = [];

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
      this.loadExistingTemplate();
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
    console.log(this.workoutPath);
  }

  async loadExistingTemplate() {
    this.workoutPath = `WorkoutTemplates/${this.templateDoc.id}/Workouts`;
    const workoutCollection = collection(this.db, this.workoutPath);
    const workoutQuery = query(workoutCollection);
    const workoutSnapshot = await getDocs(workoutQuery);
    workoutSnapshot.forEach((doc) => {
      this.workouts$.push({
        workoutId: doc.id,
        workoutData: doc.data(),
        userPerformance: {
          'Ian': {
            performed: false,
            instanceData: {}
          },
          'Holly': {
            performed: false,
            instanceData: {}
          }
        }
      })
    })
    console.log(this.workoutPath);
  }

  addWorkout(workout: Workout) {
    this.workouts$.push(workout);
    console.log('added new workout', this.workouts$);
  }

  async finishWorkout() {
    let counter = 0;
    this.workouts$.forEach((workout) => {
      let didWorkout = false;
      counter++;
      Object.keys(workout.userPerformance).forEach(async (user) => {
        if (workout.userPerformance[user].performed) {
          didWorkout = true;
          await this.saveWorkoutInstance(
            workout.userPerformance[user].instanceData,
            workout.workoutId,
            workout.workoutData['displayName'],
            user
          );
        }
      })
      if (didWorkout) {
        this.updateWorkoutDate(workout.workoutId);
      }
      console.log(counter, this.workouts$.length, this.historyDocs.length);
      if (counter === this.workouts$.length && this.historyDocs.length > 0) {
        console.log(counter, 'hit cap (', this.workouts$.length, '), loading in', this.historyDocs.length, 'historyDocs');
        this.saveHistoryInstance();
      }
    }
  );

  }

  async saveWorkoutInstance(instanceData: DocumentData, workoutId: string, workoutName: string, user: string) {
    const path = `${this.workoutPath}/${workoutId}/Users/${user}/Instances`;
    const instanceRef = doc(collection(this.db, path));
    this.historyDocs.push({
      user: user,
      instanceRef: `${path}/${instanceRef.id}`,
      workoutName: workoutName
    });
    await setDoc(instanceRef, instanceData);
  }

  async updateWorkoutDate(workoutId: string) {
    const path = `${this.workoutPath}/${workoutId}`;
    const workoutRef = doc(this.db, path);
    await updateDoc(workoutRef, {
      latestWorkout: serverTimestamp()
    })
  }

  async saveHistoryInstance() {
    const historyRef = doc(collection(this.db, "History"));
    const historyData = {
      date: serverTimestamp(),
      displayName: this.templateName,
      instances: this.historyDocs
    }
    await setDoc(historyRef, historyData);
  }
}
