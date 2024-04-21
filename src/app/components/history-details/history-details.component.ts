import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  DocumentData,
  Firestore, 
  doc,
  getDoc
} from '@angular/fire/firestore';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-history-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatCardModule,
  ],
  templateUrl: './history-details.component.html',
  styleUrl: './history-details.component.scss'
})
export class HistoryDetailsComponent {
  // TODO: leverage the actual reference type for firestore
  @Input() instance$!: DocumentData;
  db: Firestore = inject(Firestore);
  instanceHistory$: DocumentData = {};

  async ngOnInit() {
    const historyDetails = await getDoc(doc(this.db, this.instance$['instanceRef']));
    if (historyDetails.exists()) {
      this.instanceHistory$ = historyDetails.data();
    } else {
      console.error("WorkoutInstance could not be retrieved from Firestore!", this.instance$['instanceRef']);
    }
  }
}
