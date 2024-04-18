import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { query } from 'firebase/firestore';
import { Observable, of } from 'rxjs';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-panel',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-panel.component.html',
  styleUrl: './add-panel.component.scss'
})
export class AddPanelComponent {

  db: Firestore = inject(Firestore);
  templates$: Observable<any[]> = of();
  activeTab = new FormControl(0);
  loaded: boolean = false;

  selectedTemplate: any;
  templateName: string = ''

  constructor(private router: Router) { }
  
  async panelOpened() {
    if (this.loaded) {
      return;
    }
    const templatesQuery = query(collection(this.db, "WorkoutTemplates"));
    this.templates$ = collectionData(templatesQuery, { idField: 'id' });
    this.loaded = true;
  }

  createTemplate() {
    const templateLinkId = this.activeTab.value === 0 ? this.selectedTemplate : this.templateName;
    //if templateLinkId is null, throw an error. shouldn't happen with proper validation in forms though
    this.router.navigateByUrl(`/add/${templateLinkId}`);
    /*
    if activeTab is on new template then we pass new template name to AddWorkoutComponent
    else we pass in the collection
    ok basically we hit /add/:templateName

    leave it to addworkoutcomponent to figure out if it's new or not. 
    then it can insert the doc into templates collection appropriately.
    */
  }
}
