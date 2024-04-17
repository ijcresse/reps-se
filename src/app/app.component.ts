import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getDocs } from 'firebase/firestore';

import { TestFirestoreComponent } from './test-firestore/test-firestore.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    TestFirestoreComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // firestore: Firestore = inject(Firestore);

  // items$: Observable<any[]>;

  constructor() {
    // const aCollection = collection(this.firestore, 'items');
    // this.items$ = collectionData(aCollection);
  }

  // ngOnInit() {
  //   getDocs(collection(this.firestore, "testPath"))
  //     .then((response) => {
  //       console.log(response.docs);
  //     })
  // }
}

/*
<ul>
  <li class="text" *ngFor="let item of items$ | async">
    {{item.name}}
  </li>
</ul>

*/