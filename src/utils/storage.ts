import type { Inventory, WorkoutSession } from '../types'

type StoredInventory = Partial<Inventory> & {
  collarWeightMode?: 'combined' | 'per-collar'
}

const STORAGE_KEYS = {
  INVENTORY: 'pwrlft_inventory',
  WORKOUTS: 'pwrlft_workouts',
  PREFERENCES: 'pwrlft_preferences'
}

const DEFAULT_KILO_PLATES = [
  { weight: 25, quantity: 2, color: '#ef4444' },
  { weight: 20, quantity: 2, color: '#2563eb' },
  { weight: 15, quantity: 2, color: '#eab308' },
  { weight: 10, quantity: 2, color: '#22c55e' },
  { weight: 5, quantity: 2, color: '#f8fafc' },
  { weight: 2.5, quantity: 2, color: '#111827' },
  { weight: 1.25, quantity: 2, color: '#94a3b8' },
  { weight: 0.5, quantity: 2, color: '#64748b' }
]

const DEFAULT_POUND_PLATES = [
  { weight: 45, quantity: 2, color: '#2563eb' },
  { weight: 35, quantity: 2, color: '#eab308' },
  { weight: 25, quantity: 2, color: '#22c55e' },
  { weight: 10, quantity: 2, color: '#f8fafc' },
  { weight: 5, quantity: 2, color: '#111827' },
  { weight: 2.5, quantity: 2, color: '#94a3b8' }
]

const DEFAULT_INVENTORY: Inventory = {
  kiloPlates: DEFAULT_KILO_PLATES,
  poundPlates: DEFAULT_POUND_PLATES,
  barWeight: { kg: 20, lbs: 45 },
  collarWeight: { kg: 0, lbs: 0 }
}

const mergePlates = (storedPlates: Inventory['kiloPlates'] | undefined, defaultPlates: Inventory['kiloPlates']) => {
  const storedByWeight = new Map((storedPlates ?? []).map((plate) => [plate.weight, plate]))

  return defaultPlates.map((defaultPlate) => {
    const storedPlate = storedByWeight.get(defaultPlate.weight)

    return {
      ...defaultPlate,
      quantity: storedPlate?.quantity ?? defaultPlate.quantity
    }
  })
}

const isLegacyInventory = (inventory: Partial<Inventory>) => {
  const kiloWeights = (inventory.kiloPlates ?? []).map((plate) => plate.weight)
  return kiloWeights.includes(16) || kiloWeights.includes(2)
}

const normalizeInventory = (inventory?: StoredInventory): Inventory => {
  if (!inventory) {
    return DEFAULT_INVENTORY
  }

  const legacyInventory = isLegacyInventory(inventory)
  const collarsAlreadyPerCollar = inventory.collarWeightMode === 'per-collar'
  const normalizedCollars = inventory.collarWeight
    ? {
        kg:
          legacyInventory && inventory.collarWeight.kg === 2.5
            ? 0
            : collarsAlreadyPerCollar
            ? inventory.collarWeight.kg
            : inventory.collarWeight.kg / 2,
        lbs:
          legacyInventory && inventory.collarWeight.lbs === 5.5
            ? 0
            : collarsAlreadyPerCollar
            ? inventory.collarWeight.lbs
            : inventory.collarWeight.lbs / 2
      }
    : DEFAULT_INVENTORY.collarWeight

  return {
    kiloPlates: mergePlates(inventory.kiloPlates, DEFAULT_KILO_PLATES),
    poundPlates: mergePlates(inventory.poundPlates, DEFAULT_POUND_PLATES),
    barWeight: inventory.barWeight ?? DEFAULT_INVENTORY.barWeight,
    collarWeight: normalizedCollars
  }
}

export const useStorage = () => {
  const getInventory = (): Inventory => {
    const stored = localStorage.getItem(STORAGE_KEYS.INVENTORY)
    if (!stored) {
      return DEFAULT_INVENTORY
    }

    const parsed = JSON.parse(stored) as StoredInventory
    const normalized = normalizeInventory(parsed)
    const normalizedWithMode: Inventory & { collarWeightMode: 'per-collar' } = {
      ...normalized,
      collarWeightMode: 'per-collar'
    }

    if (JSON.stringify(parsed) !== JSON.stringify(normalizedWithMode)) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(normalizedWithMode))
    }

    return normalized
  }

  const saveInventory = (inventory: Inventory): void => {
    localStorage.setItem(
      STORAGE_KEYS.INVENTORY,
      JSON.stringify({
        ...inventory,
        collarWeightMode: 'per-collar'
      })
    )
  }

  const getWorkouts = (): WorkoutSession[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.WORKOUTS)
    return stored ? JSON.parse(stored) : []
  }

  const saveWorkouts = (workouts: WorkoutSession[]): void => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
  }

  const addWorkout = (session: WorkoutSession): void => {
    const workouts = getWorkouts()
    workouts.push(session)
    saveWorkouts(workouts)
  }

  const deleteWorkout = (id: string): void => {
    const workouts = getWorkouts()
    const filtered = workouts.filter(w => w.id !== id)
    saveWorkouts(filtered)
  }

  return {
    getInventory,
    saveInventory,
    getWorkouts,
    saveWorkouts,
    addWorkout,
    deleteWorkout
  }
}
