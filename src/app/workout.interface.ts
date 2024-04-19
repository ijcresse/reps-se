import { DocumentData, Timestamp } from "firebase/firestore"

export interface Workout {
    workoutId: string
    workoutData: DocumentData,
    ianData: DocumentData,
    hollyData: DocumentData,
    performed: string[]
}

export interface AerobicData {
    hours: number,
    minutes: number,
    notes: string
}

export interface AnaerobicData {
    date: Timestamp,
    performance: {
        sets: number,
        reps: number,
        weight: number
    }
}