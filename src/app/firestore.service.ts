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

  objectifyData(data: any) {
    return JSON.parse(JSON.stringify(data));
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
  async getLastWorkoutInstanceForUser(path: string) {
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
      const data = doc.data();
      workoutDocs.push({
        id: doc.id,
        displayName: data['displayName'],
        path: `${workoutPath}/${doc.id}`,
        type: data['type']
      });
    });
    return workoutDocs;
  }

  //after a workout is complete, save updated instances and add a history entry
  async saveFinishedWorkoutTemplate(templateName: string, instanceMap: any): Promise<void> {
    const batch = writeBatch(this.db);
    const historyRef = this.getRefFromCollectionPath("History");
    let historyInstances = [];
    for (const [path, data] of instanceMap) {
      const instanceRef = this.getRefFromCollectionPath(path);
      const objectifiedData: DocumentData = this.objectifyData(data);
      //need to reset date here - otherwise becomes a methodref
      objectifiedData['date'] = serverTimestamp();
      batch.set(instanceRef, objectifiedData);
      
      const pathValues = path.split('/');
      //TODO: all this is a little irrelevant. shouldn't it just be the instanceRef path?
      //from there i could pass it all to a splitter/pathutil and manage it that way.
      historyInstances.push({
        user: pathValues[5],
        instanceRef: instanceRef.path,
        workoutName: pathValues[3]
      })
    }

    batch.set(historyRef, {
      date: serverTimestamp(),
      displayName: templateName,
      instances: historyInstances
    });
    return await batch.commit();
  }
}
