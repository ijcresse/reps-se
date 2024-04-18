import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-workout',
  standalone: true,
  imports: [],
  templateUrl: './add-workout.component.html',
  styleUrl: './add-workout.component.scss'
})
export class AddWorkoutComponent {
  templateId: string | null;

  constructor(private route: ActivatedRoute) { 
    // console.log(this.route.snapshot.paramMap.get('templateId'));
    this.templateId = this.route.snapshot.paramMap.get('templateId');

    //throw errro and redirect to error page if templateId isn't there.
  }
}
