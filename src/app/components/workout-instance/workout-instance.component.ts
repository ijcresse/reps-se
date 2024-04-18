import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  DocumentData,
  Firestore, 
  doc,
  getDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-workout-instance',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './workout-instance.component.html',
  styleUrl: './workout-instance.component.scss'
})
export class WorkoutInstanceComponent {
  @Input() instanceRef!: string;
  db: Firestore = inject(Firestore);
  instance$: DocumentData | undefined;

  async ngOnInit() {
    const workoutInstance = await getDoc(doc(this.db, this.instanceRef));
    if (workoutInstance.exists()) {
      this.instance$ = workoutInstance.data();
    } else {
      console.error("WorkoutInstance could not be retrieved from Firestore!", this.instanceRef);
    }
  }
}
