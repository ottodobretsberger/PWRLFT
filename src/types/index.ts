export type DistanceUnit = 'kg' | 'lbs'

export interface Plate {
  weight: number
  quantity: number
  color: string
}

export interface Inventory {
  kiloPlates: Plate[]
  poundPlates: Plate[]
  barWeight: {
    kg: number
    lbs: number
  }
  collarWeight: {
    kg: number
    lbs: number
  }
}

export interface LoaderResult {
  plates: {
    weight: number
    quantity: number
    color: string
    side: 'each side' | 'total'
  }[]
  totalLoaded: number
  unit: DistanceUnit
}

export interface RMFormula {
  name: string
  calculate: (weight: number, reps: number) => number
}

export interface WorkoutSet {
  exercise: string
  weight: number
  reps: number
  unit: DistanceUnit
  rm1: number
  timestamp: number
}

export interface WorkoutSession {
  id: string
  date: number
  exercises: {
    name: string
    sets: WorkoutSet[]
  }[]
  notes?: string
}

export interface WorkoutStats {
  totalSessions: number
  totalExercises: number
  personalRecords: {
    exercise: string
    weight: number
    unit: DistanceUnit
    date: number
  }[]
  averageRM: number
}
