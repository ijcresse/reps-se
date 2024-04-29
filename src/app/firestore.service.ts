import { Injectable, inject } from '@angular/core';

import { Firestore, collectionData } from '@angular/fire/firestore';
import { 
  DocumentData, 
  DocumentReference, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  limit, 
  orderBy, 
  query, 
  serverTimestamp,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { Observable } from 'rxjs';

import { Workout } from './workout.interface';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  db: Firestore = inject(Firestore);

  constructor() { }

  async getHistoryDocs(): Promise<DocumentData[]> {
    const q = query(
      collection(this.db, "History"), 
      orderBy('date', 'desc'), 
      limit(15)
    );
    const snapshot = await getDocs(q);
    let historyDocs: DocumentData[] = [];
    snapshot.forEach((doc) => {
      historyDocs.push(doc.data());
    })
    return historyDocs;
  }

  async getHistoryInstanceDocOrNull(instanceRef: string): Promise<DocumentData> {
    return await getDoc(doc(this.db, instanceRef));
  }

  async getWorkoutTemplateDocs(): Promise<Observable<DocumentData[]>> {
    const q = query(collection(this.db, "WorkoutTemplates"));
    return collectionData(q, { idField: 'id' });
  }

  async createWorkoutTemplate(templateId: string, templateName: string) {
    const ref = doc(this.db, "WorkoutTemplates", templateId);
    const templateDoc = {
      displayName: templateName,
      latestWorkout: serverTimestamp()
    }
    await setDoc(ref, templateDoc);
  }

  async loadWorkoutTemplate(workoutPath: string): Promise<Workout[]> {
    const q = query(collection(this.db, workoutPath));
    const snapshot = await getDocs(q);
    let workoutDocs: Workout[] = [];
    snapshot.forEach((doc) => {
      workoutDocs.push({
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
    });
    return workoutDocs;
  }

  makeRefFromPath(path: string) {
    return doc(collection(this.db, path));
  }

  async saveFinishedWorkout(
      workoutInstances: Map<DocumentReference, DocumentData>, 
      workoutRefs: DocumentReference[], 
      historyInstances: DocumentData[],
      templateName: string
  ): Promise<void> {
    const batch = writeBatch(this.db);

    workoutRefs.forEach(workoutRef => {
      batch.update(workoutRef, {latestWorkout: serverTimestamp()});
    });
    
    for (const [ref, doc] of workoutInstances) {
      batch.set(ref, doc);
    }

    const historyRef = this.makeRefFromPath("History");
    const historyDoc = {
      date: serverTimestamp(),
      displayName: templateName,
      instances: historyInstances
    }
    batch.set(historyRef, historyDoc);

    return await batch.commit();
  }
}
