import { Injectable, inject } from '@angular/core';

import { Firestore, collectionData } from '@angular/fire/firestore';
import { 
  DocumentData, 
  DocumentReference, 
  DocumentSnapshot, 
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

  //General utilities/passthru functionality
  getRefFromCollectionPath(path: string): DocumentReference {
    return doc(collection(this.db, path));
  }

  getRefFromDocPath(path: string): DocumentReference {
    return doc(this.db, path);
  }

  async setDoc(ref: DocumentReference, doc: DocumentData): Promise<void> {
    return await setDoc(ref, doc);
  }

  async getDoc(ref: DocumentReference): Promise<DocumentSnapshot> {
    return await getDoc(ref);
  }

  //home
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

  //workout-instance
  async getLastWorkoutInstanceForUser(path: string, user: string) {
    const ref = collection(this.db, path);
    const q = query(ref, orderBy("date", "desc"), limit(1));
    return await getDocs(q);
  }

  //add-template
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

  //add-route
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

    const historyRef = this.getRefFromCollectionPath("History");
    const historyDoc = {
      date: serverTimestamp(),
      displayName: templateName,
      instances: historyInstances
    }
    batch.set(historyRef, historyDoc);

    return await batch.commit();
  }
}
