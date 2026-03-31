import type { RMFormula, DistanceUnit } from '../types'

export const convertWeight = (weight: number, from: DistanceUnit, to: DistanceUnit): number => {
  if (from === to) return weight
  if (from === 'kg' && to === 'lbs') return weight * 2.20462
  if (from === 'lbs' && to === 'kg') return weight / 2.20462
  return weight
}

export const rmFormulas = {
  epley: (weight: number, reps: number): number => {
    return weight * (1 + reps / 30)
  },
  brzycki: (weight: number, reps: number): number => {
    return (weight * 36) / (37 - reps)
  },
  mcglothin: (weight: number, reps: number): number => {
    return (100 * weight) / (101.3 - 2.67123 * reps)
  },
  lombardi: (weight: number, reps: number): number => {
    return weight * Math.pow(reps, 0.1)
  },
  mayhew: (weight: number, reps: number): number => {
    return (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps))
  },
  oconner: (weight: number, reps: number): number => {
    return weight * (1 + reps / 40)
  },
  wathen: (weight: number, reps: number): number => {
    return (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps))
  }
}

export const formulaList: RMFormula[] = [
  { name: 'Epley', calculate: rmFormulas.epley },
  { name: 'Brzycki', calculate: rmFormulas.brzycki },
  { name: 'McGlothin', calculate: rmFormulas.mcglothin },
  { name: 'Lombardi', calculate: rmFormulas.lombardi },
  { name: 'Mayhew', calculate: rmFormulas.mayhew },
  { name: 'O\'Conner', calculate: rmFormulas.oconner },
  { name: 'Wathen', calculate: rmFormulas.wathen }
]

export const calculateAverage1RM = (rms: number[]): number => {
  if (rms.length === 0) return 0
  return rms.reduce((a, b) => a + b, 0) / rms.length
}

export const roundToTwo = (num: number): number => {
  return Math.round(num * 100) / 100
}
