import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { 
  getDocs, 
  getDoc, 
  setDoc, 
  doc,
  query
} from 'firebase/firestore';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-test-firestore',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './test-firestore.component.html',
  styleUrl: './test-firestore.component.scss'
})
export class TestFirestoreComponent {
  firestore: Firestore = inject(Firestore);
  templates$: Observable<any[]> = of();
  chestDayWorkouts$: Observable<any[]> = of();
  chestDayWorkoutInstances$: Observable<any[]> = of();
  
  constructor() {
  }

  async fetchTemplates() {
    // const q = query(collection(this.firestore, 'WorkoutTemplates'));
    // const qSnap = await getDocs(q);
    // qSnap.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });
    const templateCollection = collection(this.firestore, 'WorkoutTemplates');
    this.templates$ = collectionData(templateCollection);
    console.log(this.templates$);
  }

  async fetchWorkoutsFromTemplate() {
    // const q = query(collection(this.firestore, "WorkoutTemplates", "ChestDay", "Workouts"));
    // const qSnap = await getDocs(q);
    // qSnap.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });
    const workoutCollection = collection(this.firestore, "WorkoutTemplates", "ChestDay", "Workouts");
    this.chestDayWorkouts$ = collectionData(workoutCollection);
  }

  async fetchInstancesFromWorkout() {
    // const q = query(collection(this.firestore, "WorkoutTemplates", "ChestDay", "Workouts", "BenchPress", "Instances"));
    // const qSnap = await getDocs(q);
    // qSnap.forEach((doc) => {
    //   console.log(doc.id, " = > ", doc.data());
    // });
    const instanceCollection = collection(this.firestore, "WorkoutTemplates", "ChestDay", "Workouts", "BenchPress", "Instances");
    this.chestDayWorkoutInstances$ = collectionData(instanceCollection);
  }

  async saveWorkoutData() {

  }

  async addWorkoutTemplate() {

  }

  async addWorkoutAndInstance() {

  }

  async updateWorkoutInstance() {

  }
}



/*
button 1:
load workout_template collection's list of documents. limit 10 let's say
const q = query(collection(db, "workout_template"), limit(10))
const templateDocsSnap = await getDocs(q);
templateDocsSnap.forEach((doc) => {
  //doc.data() is never undefined
  console.log(doc.id, " = > ", doc.data());
})

button 2:
load workout_day/<chest id>/
const q = query(collection(db, "workout_template", "<chest_id>", "workout"))

button 3:
const q = query(collection)
*/

/*
query(collection(database, "collection_name"))
await getDocs(query) //get lots of docs

docRef = doc(database, "collection_name", "doc_key");
await getDoc(docRef); //specific doc

newDocRef = doc(database, "collection_name", "doc_key")
newDocData = {
  1: 2
  3: 4
  5: [
    6, 7, 8
  ]
}
await setDoc(newDoc, newDocData)

converters are common use cases for structured data
class Workout {
  constructor(name) {
    this.name = name;
  }
}

const workoutConverter = {
  toFirestore: (workout) => {
    return {
      name: workout.name;
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Workout(name);
  }
}
*/