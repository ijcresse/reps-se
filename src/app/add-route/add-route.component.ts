import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection } from '@angular/fire/firestore';
import { DocumentData, DocumentReference, doc, getDocs, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WorkoutPanelComponent } from '../components/workout-panel/workout-panel.component';
import { AddWorkoutPanelComponent } from '../components/add-workout-panel/add-workout-panel.component';
import { FirestoreService } from '../firestore.service';
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
  dbService: FirestoreService = inject(FirestoreService);

  isExistingTemplate!: boolean;
  templateId;
  //TODO: templateDoc is unnecessary. pare down
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
    // await this.dbService.createWorkoutTemplate(this.templateId, this.templateName)
    // .then(() => {
      
    // });
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

  async finishWorkout() {
    const workoutInstances: Map<DocumentReference, DocumentData> = new Map();
    const workouts: DocumentReference[] = [];
    const historyDocs: DocumentData[] = [];
    this.createDocs(workoutInstances, workouts, historyDocs);

    if (workouts.length > 0 && historyDocs.length > 0) {
      await this.dbService.saveFinishedWorkout(workoutInstances, workouts, historyDocs, this.templateName)
      .then(() => {
        this.openSnackBar(`${this.templateName} complete!`, "OK");
      });
    } else {
      this.openSnackBar("No completed workouts detected!", "OK");
    }
  }

  //assembles information from each workout and creates historyDocs at the same time
  createDocs(
      workoutInstances: Map<DocumentReference, DocumentData>, 
      workouts:  DocumentReference[],
      historyDocs: DocumentData[]
  ) {
    this.workouts$.forEach((workout) => {
      let didWorkout = false;
      Object.keys(workout.userPerformance).forEach((user) => {
        if (workout.userPerformance[user].performed) {
          didWorkout = true;

          const instancePath = `${this.workoutPath}/${workout.workoutId}/Users/${user}/Instances`
          const instanceRef = this.dbService.makeRefFromPath(instancePath);
          workoutInstances.set(instanceRef, workout.userPerformance[user].instanceData);

          historyDocs.push({
            user: user,
            instanceRef:`${instancePath}/${instanceRef.id}`,
            workoutName: workout.workoutData['displayName']
          })
        }
      })

      if (didWorkout) {
        const workoutRef = this.dbService.makeRefFromPath(`${this.workoutPath}/${workout.workoutId}`);
        workouts.push(workoutRef);
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
