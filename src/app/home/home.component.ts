import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

import { HistoryPanelComponent } from '../components/history-panel/history-panel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    HistoryPanelComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  db: Firestore = inject(Firestore);
  history$: Observable<any[]> = of();

  title: string = 'Reps.';

  ngOnInit() {
    const historyCollection = collection(this.db, "History");
    this.history$ = collectionData(historyCollection);
  }
}
