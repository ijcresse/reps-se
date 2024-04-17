import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { 
  Firestore, 
  collection, 
  collectionData 
} from '@angular/fire/firestore';
import {
  doc,
  getDocs,
  limit,
  orderBy,
} from 'firebase/firestore';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  db: Firestore = inject(Firestore);
  history$: Observable<any[]> = of();

  title: string = 'Reps.';
  panelOpenState: boolean = false;

  constructor() {

  }

  ngOnInit() {
    const historyCollection = collection(this.db, "History");
    this.history$ = collectionData(historyCollection);
  }
}
