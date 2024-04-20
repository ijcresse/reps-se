import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

import { DocumentData, Firestore, collection } from '@angular/fire/firestore';

import { AddTemplatePanelComponent } from '../components/add-template-panel/add-template-panel.component';
import { HistoryPanelComponent } from '../components/history-panel/history-panel.component';
import { getDocs, limit, orderBy, query } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    AddTemplatePanelComponent,
    HistoryPanelComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  db: Firestore = inject(Firestore);
  history$: DocumentData[] = [];

  title: string = 'Reps.';

  async ngOnInit() {
    const historyCollection = collection(this.db, "History");
    const historyQuery = query(historyCollection, orderBy('date', 'desc'), limit(15));
    const historySnapshot = await getDocs(historyQuery);
    historySnapshot.forEach((doc) => {
      this.history$.push(doc.data());
    })
  }
}
