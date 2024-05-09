import { 
  Component, 
  Input,
  AfterViewInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';

import { WorkoutInstanceComponent } from '../workout-instance/workout-instance.component';
import { DocumentData } from 'firebase/firestore';

//simple containing expansionpanel for individual workout instances within.
@Component({
  selector: 'app-workout-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    WorkoutInstanceComponent
  ],
  templateUrl: './workout-panel.component.html',
  styleUrl: './workout-panel.component.scss'
})
export class WorkoutPanelComponent {
  @Input() workoutId!: string;
  @Input() workoutName!: string;
  @Input() workoutPath!: string;
  @Input() workoutType!: number;
  @Input() templateColor!: string;
  @Input() index!: number;

  @ViewChildren(WorkoutInstanceComponent) instanceComponents?: QueryList<WorkoutInstanceComponent>;

  //initially empty - workouts don't get color until they're performed.
  panelColor: string = "";

  //TODO: dont like this too much but i can refactor this with the stringbuilder stuff later
  userPath: string = "";

  ngOnInit() {
    this.userPath = `${this.workoutPath}/${this.workoutId}/Users`;
  }

  //assembles data for add-route
  getWorkoutData() {
    const instanceData = this.fetchDataFromInstance();
    const workoutData = {
      workoutPath: `${this.workoutPath}/${this.workoutId}`,
      instanceData: instanceData
    }
    return workoutData;
  }

  //workout panel needs: path. id. type. displayname.

  /*
  ok here's where things are a little funny.
  when fetching data from instance, i want to track the user's instancepath as well as the instance data itself.
  so i'm tracking two variables.
  i need to keep these aligned and contained.
  when i return from HERE,
  i want to return a workoutpath and the object containing instancepath,instancedata.

  but when i hit addroute, i've got:
  workouts[{
    path
    instances[{
      path
      data
    }]
  }]

  how do i process that?
  in addroute: (ok. this should actually be a dbservice thing - process data for batch save transaction)
  if workouts.length is 0, stop work and show snackbar saying there's nothin in here man!!!

  dbWorkouts[ref]
  dbInstances<ref,doc>
  dbHistories[ref]
  getdata, then
    foreach workouts
      push documentdata with servertimestamp
      foreach workouts.instances
        push dbinstances
        push dbhistories

  then pass to dbservice.
  */
  fetchDataFromInstance(): Map<string, DocumentData> {
    let instanceData: Map<string, DocumentData> = new Map();

    if (this.instanceComponents) {
      for (let i = 0; i < this.instanceComponents.length; i++) {
        const instance = this.instanceComponents.get(i);
        if (instance && instance.wasPerformed()) {
          instanceData.set(instance.getPath(), instance.getData());
        }
      }
    }
    return instanceData;
  }
}