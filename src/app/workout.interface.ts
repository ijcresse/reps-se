import { DocumentData } from "firebase/firestore"

export interface Workout {
    workoutId: string
    workoutData: DocumentData,
    instanceData: DocumentData
}