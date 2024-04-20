import { DocumentData, Timestamp } from "firebase/firestore"

export interface Workout {
    workoutId: string
    workoutData: DocumentData,
    userPerformance: UserPerformance,
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