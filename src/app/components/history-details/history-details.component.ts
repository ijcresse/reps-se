import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  DocumentData,
  doc,
  getDoc
} from '@angular/fire/firestore';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../../firestore.service';

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
  @Input() instance$!: DocumentData;
  db: FirestoreService = inject(FirestoreService);
  instanceHistory$: DocumentData = {};

  async ngOnInit() {
    const ref = this.db.getRefFromDocPath(this.instance$['instanceRef']);
    this.db.getDoc(ref)
    .then((doc) => {
      if (doc.exists()) {
        this.instanceHistory$ = doc.data();
      } else {
        console.error("WorkoutInstance could not be retrieved from Firestore!", this.instance$['instanceRef']);
      }
    });
  }
}
