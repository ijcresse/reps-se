import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

import { AddTemplatePanelComponent } from '../components/add-template-panel/add-template-panel.component';
import { HistoryPanelComponent } from '../components/history-panel/history-panel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
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
  history$: Observable<any[]> = of();

  title: string = 'Reps.';

  constructor(public dialog: MatDialog) {

  }

  ngOnInit() {
    const historyCollection = collection(this.db, "History");
    this.history$ = collectionData(historyCollection);
  }
}
