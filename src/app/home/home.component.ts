import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

import { DocumentData } from '@angular/fire/firestore';

import { AddTemplatePanelComponent } from '../components/add-template-panel/add-template-panel.component';
import { HistoryPanelComponent } from '../components/history-panel/history-panel.component';
import { FirestoreService } from '../firestore.service';

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
  db: FirestoreService = inject(FirestoreService);
  history$: DocumentData[] = [];

  title: string = 'Reps.';

  async ngOnInit() {
    await this.db.getHistoryDocs()
    .then((docs) => {
      this.history$ = docs;
    })
  }
}
