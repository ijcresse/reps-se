# RepsSe

A simple workout tracker app to match a couple of use cases:

- A user can quickly see which workout days they've completed in order
- A user can look at a particular workout day for more details
- A user can create a new workout day from a template, or create a blank template
- A user can immediately see which workouts exist for that template
- A user can add a new workout to that template
- A user can open a workout containing the most recent performance for that individual user and update its data ('doing' the workout for that workout day)
- A user can save a workout day and see it represented on the main page's history section
- A user can save a workout instance independently of their workout partner (ex. one workout partner missed a week) and have the data still be consistent
- A user can quickly view workout history by bypassing the login screen as a 'guest user.' Read only, no writes.

## Installation notes

This project was built on Angular17, with AngularFire v17.
For ease of use, ensure the Angular CLI and Firebase CLI are installed.
Email and password auth is required. Setup here:
`https://console.firebase.google.com/u/1/project/<your db>/authentication/users`

## Development server

Setup a firestore database and drop your config into the `/src/environments`:
```
export const environment = {
    firebaseConfig: {
        //your config here
    }
}
```
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Deploy to Firebase

#### First time deploy

If you haven't tied your Firestore config to your webapp, go to the Firebase console and access your Firestore config and follow the instructions on the page.
With your registered webapp, follow instructions for deploying it to Firebase.

#### Successive deploys

`firebase deploy`
