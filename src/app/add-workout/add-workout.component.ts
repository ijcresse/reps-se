import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData, DocumentReference } from '@angular/fire/firestore';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-add-workout',
  standalone: true,
  imports: [],
  templateUrl: './add-workout.component.html',
  styleUrl: './add-workout.component.scss'
})
export class AddWorkoutComponent {
  db: Firestore = inject(Firestore);
  isExistingTemplate!: boolean;
  templateDoc;
  templateName;
  workouts$: Observable<any[]> = of();

  constructor() { 
    this.isExistingTemplate = history.state.isExistingTemplate;
    if (this.isExistingTemplate) {
      this.templateDoc = history.state.templateDoc;
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
      const templateId = this.templateDoc.id;
      const workoutCollection = collection(this.db, "WorkoutTemplates", templateId, "Workouts");
      this.workouts$ = collectionData(workoutCollection);
    }
  }

  async createNewTemplate() {
    const templateId: string = this.pascalCase(this.templateName);
    console.log('transforming', this.templateName, 'to pascalcase:', templateId);
    const templateDocRef = doc(this.db, "WorkoutTemplates", templateId);
    const templatesDoc = {
      displayName: this.templateName,
      color: "tbd",
      latestWorkout: serverTimestamp()
    }
    await setDoc(templateDocRef, templatesDoc);
  }

  pascalCase(s: string) {
    return s.replace(/(\w)(\w*)/g, function(g0,g1,g2) {
      return g1.toUpperCase() + g2.toLowerCase();
    });
  }
}
