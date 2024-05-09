import { DocumentData, Timestamp } from "firebase/firestore"

export interface Workout {
    id: string,
    displayName: string,
    path: string,
    type: number
}

export interface UserPerformance {
    [index: string]: {
        performed: boolean,
        instanceData: DocumentData
    }
}

export interface HistoryInstance {
    user: string,
    instanceRef: string,
    workoutName: string
}