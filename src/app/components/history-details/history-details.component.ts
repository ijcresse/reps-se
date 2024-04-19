import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  DocumentData,
  Firestore, 
  doc,
  getDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-history-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './history-details.component.html',
  styleUrl: './history-details.component.scss'
})
export class HistoryDetailsComponent {
  @Input() instanceRef!: string;
  db: Firestore = inject(Firestore);
  instance$: DocumentData | undefined;

  async ngOnInit() {
    const historyDetails = await getDoc(doc(this.db, this.instanceRef));
    if (historyDetails.exists()) {
      this.instance$ = historyDetails.data();
    } else {
      console.error("WorkoutInstance could not be retrieved from Firestore!", this.instanceRef);
    }
  }
}
