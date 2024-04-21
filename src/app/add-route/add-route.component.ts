import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection } from '@angular/fire/firestore';
import { DocumentData, doc, getDocs, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WorkoutPanelComponent } from '../components/workout-panel/workout-panel.component';
import { AddWorkoutPanelComponent } from '../components/add-workout-panel/add-workout-panel.component';
import { Workout, HistoryInstance } from '../workout.interface';
import { Util } from '../util';

@Component({
  selector: 'app-add-route',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    AddWorkoutPanelComponent,
    WorkoutPanelComponent
  ],
  templateUrl: './add-route.component.html',
  styleUrl: './add-route.component.scss'
})
export class AddRouteComponent {
  db: Firestore = inject(Firestore);
  isExistingTemplate!: boolean;
  templateId;
  templateDoc;
  templateName;
  workoutPath: string = "";

  workouts$: Workout[] = [];
  historyDocs: HistoryInstance[] = [];

  constructor(private _snackBar: MatSnackBar) { 
    this.isExistingTemplate = history.state.isExistingTemplate;
    if (this.isExistingTemplate) {
      this.templateDoc = history.state.templateDoc;
      this.templateName = this.templateDoc.displayName;
      this.templateId = Util.pascalCase(this.templateName)
    } else {
      this.templateName = history.state.templateName;
      this.templateId = Util.pascalCase(this.templateName)
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
    const templateDocRef = doc(this.db, "WorkoutTemplates", this.templateId);
    const templateDoc = {
      displayName: this.templateName,
      color: "tbd",
      latestWorkout: serverTimestamp()
    }
    await setDoc(templateDocRef, templateDoc)
      .then(() => {
        this.templateDoc = templateDoc
        this.templateDoc.id = this.templateId;
        this.workoutPath = `WorkoutTemplates/${this.templateId}/Workouts`;
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
  }

  addWorkout(workout: Workout) {
    this.workouts$.push(workout);
  }

  //TODO: a little ugly. restructure this
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
      if (counter === this.workouts$.length && this.historyDocs.length > 0) {
        this.saveHistoryInstance();
      }
    });

    this.openSnackBar(`${this.templateName} complete!`, 'OK');
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
