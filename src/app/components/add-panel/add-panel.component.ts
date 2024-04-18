import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  
  async panelOpened() {
    if (this.loaded) {
      console.log('panel opened without reloading data');
      return;
    }
    const templatesQuery = query(collection(this.db, "WorkoutTemplates"));
    this.templates$ = collectionData(templatesQuery, { idField: 'id' });
    console.log('panel opened, loading data', this.templates$);
    this.loaded = true;
  }

  createTemplate() {
    console.log('selected template:', this.selectedTemplate, 'templateName', this.templateName, 'activeTab', this.activeTab.value);
    /*
    if activeTab is on new template then we pass new template name to AddWorkoutComponent
    else we pass in the collection
    ok basically we hit /add/:templateName

    leave it to addworkoutcomponent to figure out if it's new or not. 
    then it can insert the doc into templates collection appropriately.
    */
  }
}
