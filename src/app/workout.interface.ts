import { DocumentData } from "firebase/firestore"

export interface Workout {
    workoutId: string
    workoutData: DocumentData,
    ianData: DocumentData,
    hollyData: DocumentData,
    performed: string[]
}