<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
      Workout Logger
    </h1>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-700">
      <button 
        @click="activeViewTab = 'log'"
        :class="[
          'px-4 py-2 font-semibold transition-all border-b-2',
          activeViewTab === 'log'
            ? 'border-red-500 text-red-400'
            : 'border-transparent text-gray-400 hover:text-white'
        ]"
      >
        Log Workout
      </button>
      <button 
        @click="activeViewTab = 'history'"
        :class="[
          'px-4 py-2 font-semibold transition-all border-b-2',
          activeViewTab === 'history'
            ? 'border-red-500 text-red-400'
            : 'border-transparent text-gray-400 hover:text-white'
        ]"
      >
        History
      </button>
      <button 
        @click="activeViewTab = 'stats'"
        :class="[
          'px-4 py-2 font-semibold transition-all border-b-2',
          activeViewTab === 'stats'
            ? 'border-red-500 text-red-400'
            : 'border-transparent text-gray-400 hover:text-white'
        ]"
      >
        Statistics
      </button>
    </div>

    <!-- Log Workout Tab -->
    <div v-show="activeViewTab === 'log'" class="space-y-4 animate-fade-in">
      <div class="card">
        <h2 class="text-xl font-bold mb-4 text-yellow-400">Log New Workout</h2>
        
        <div class="space-y-4">
          <!-- Exercise Name -->
          <div>
            <label class="block text-sm text-gray-400 mb-2 font-semibold">Exercise Name</label>
            <input 
              v-model="newWorkout.exercise"
              type="text"
              class="input-field w-full"
              placeholder="e.g., Bench Press"
            />
          </div>

          <!-- Sets -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="block text-sm text-gray-400 font-semibold">Sets</label>
              <button @click="addSet" class="btn-secondary text-sm py-1 px-3">+ Add Set</button>
            </div>

            <div v-for="(set, idx) in newWorkout.sets" :key="idx" class="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-3">
              <div class="flex justify-between items-center">
                <h4 class="font-semibold">Set {{ idx + 1 }}</h4>
                <button 
                  @click="removeSet(idx)"
                  class="text-red-400 hover:text-red-300 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="text-xs text-gray-500 block mb-1">Weight</label>
                  <input 
                    v-model.number="set.weight"
                    type="number"
                    step="0.5"
                    class="input-field w-full"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-500 block mb-1">Reps</label>
                  <input 
                    v-model.number="set.reps"
                    type="number"
                    min="1"
                    class="input-field w-full"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-500 block mb-1">Unit</label>
                  <select v-model="set.unit" class="input-field w-full">
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div class="bg-gray-800 p-2 rounded text-center">
                <p class="text-xs text-gray-500">Estimated 1RM (Epley)</p>
                <p class="text-lg font-bold text-green-400">{{ estimateRM(set.weight, set.reps).toFixed(1) }} {{ set.unit }}</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm text-gray-400 mb-2 font-semibold">Notes</label>
            <textarea 
              v-model="newWorkout.notes"
              class="input-field w-full h-24"
              placeholder="How did it feel? Any notes?"
            ></textarea>
          </div>

          <button @click="saveWorkout" class="btn-primary w-full">
            Save Workout
          </button>
        </div>
      </div>
    </div>

    <!-- History Tab -->
    <div v-show="activeViewTab === 'history'" class="space-y-4 animate-fade-in">
      <div v-if="workouts.length === 0" class="card text-center py-12 opacity-75">
        <p class="text-lg text-gray-400">No workouts logged yet. Start logging to see your history!</p>
      </div>

      <div v-for="session in sortedWorkouts" :key="session.id" class="card">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-sm text-gray-400">{{ formatDate(session.date) }}</p>
            <h3 class="text-xl font-bold text-cyan-400">
              {{ session.exercises[0]?.name || 'Workout' }}
            </h3>
          </div>
          <button 
            @click="deleteWorkout(session.id)"
            class="text-red-400 hover:text-red-300 font-semibold"
          >
            Delete
          </button>
        </div>

        <div class="space-y-2">
          <div v-for="(ex, idx) in session.exercises" :key="idx" class="bg-gray-900 p-3 rounded border border-gray-700">
            <p class="font-semibold mb-2">{{ ex.name }}</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div v-for="(set, setIdx) in ex.sets" :key="setIdx" class="bg-gray-800 p-2 rounded">
                <p class="text-gray-400">Set {{ setIdx + 1 }}</p>
                <p class="font-bold">{{ set.weight }} {{ set.unit }}</p>
                <p class="text-xs text-gray-500">{{ set.reps }} reps</p>
                <p class="text-xs text-yellow-400">1RM: {{ set.rm1.toFixed(1) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Tab -->
    <div v-show="activeViewTab === 'stats'" class="space-y-4 animate-fade-in">
      <div v-if="stats.totalSessions === 0" class="card text-center py-12 opacity-75">
        <p class="text-lg text-gray-400">Not enough data for statistics yet</p>
      </div>

      <div v-else class="space-y-4">
        <!-- Summary Stats -->
        <div class="grid md:grid-cols-3 gap-4">
          <div class="card bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-blue-600">
            <p class="text-gray-400 text-sm mb-2">Total Workouts</p>
            <p class="text-3xl font-bold text-blue-400">{{ stats.totalSessions }}</p>
          </div>
          <div class="card bg-gradient-to-br from-purple-900/30 to-purple-900/10 border-purple-600">
            <p class="text-gray-400 text-sm mb-2">Exercises Logged</p>
            <p class="text-3xl font-bold text-purple-400">{{ stats.totalExercises }}</p>
          </div>
          <div class="card bg-gradient-to-br from-green-900/30 to-green-900/10 border-green-600">
            <p class="text-gray-400 text-sm mb-2">Average 1RM</p>
            <p class="text-3xl font-bold text-green-400">{{ stats.averageRM.toFixed(1) }}</p>
          </div>
        </div>

        <!-- Personal Records -->
        <div class="card">
          <h3 class="text-xl font-bold mb-4 text-red-400">Personal Records</h3>
          <div v-if="stats.personalRecords.length === 0" class="text-gray-500 text-center py-4">
            No personal records yet
          </div>
          <div v-else class="space-y-3">
            <div v-for="(pr, idx) in stats.personalRecords.slice(0, 5)" :key="idx" class="flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-700">
              <div>
                <p class="font-semibold">{{ pr.exercise }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(pr.date) }}</p>
              </div>
              <p class="text-2xl font-bold text-yellow-400">{{ pr.weight }} {{ pr.unit }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Success Message -->
    <transition name="fade">
      <div v-if="showSaveMessage" class="fixed bottom-4 right-4 bg-green-900/90 border border-green-500 text-green-400 px-6 py-4 rounded-lg shadow-lg animate-fade-in z-50">
          Workout saved successfully!
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { WorkoutSession, WorkoutSet, DistanceUnit, WorkoutStats } from '../types'
import { useStorage } from '../utils/storage'
import { rmFormulas } from '../utils/calculations'

const { getWorkouts, addWorkout, deleteWorkout: deleteWorkoutStorage } = useStorage()
const workouts = ref<WorkoutSession[]>([])

const activeViewTab = ref<'log' | 'history' | 'stats'>('log')
const showSaveMessage = ref(false)

const newWorkout = ref<{
  exercise: string
  sets: WorkoutSet[]
  notes?: string
}>({
  exercise: '',
  sets: [{ exercise: '', weight: 100, reps: 5, unit: 'kg' as DistanceUnit, rm1: 0, timestamp: 0 }],
  notes: ''
})

onMounted(() => {
  workouts.value = getWorkouts()
})

const sortedWorkouts = computed(() => {
  return [...workouts.value].sort((a, b) => b.date - a.date)
})

const stats = computed((): WorkoutStats => {
  if (workouts.value.length === 0) {
    return {
      totalSessions: 0,
      totalExercises: 0,
      personalRecords: [],
      averageRM: 0
    }
  }

  const uniqueExercises = new Set<string>()
  const prMap = new Map<string, { weight: number; date: number; unit: DistanceUnit }>()
  let totalRM1 = 0
  let totalSets = 0

  for (const session of workouts.value) {
    for (const exercise of session.exercises) {
      uniqueExercises.add(exercise.name)
      for (const set of exercise.sets) {
        totalRM1 += set.rm1
        totalSets++

        const key = exercise.name
        if (!prMap.has(key) || prMap.get(key)!.weight < set.weight) {
          prMap.set(key, { weight: set.weight, date: session.date, unit: set.unit })
        }
      }
    }
  }

  const personalRecords = Array.from(prMap.entries()).map(([exercise, { weight, date, unit }]) => ({
    exercise,
    weight,
    date,
    unit
  }))

  return {
    totalSessions: workouts.value.length,
    totalExercises: uniqueExercises.size,
    personalRecords: personalRecords.sort((a, b) => b.weight - a.weight),
    averageRM: totalSets > 0 ? totalRM1 / totalSets : 0
  }
})

const estimateRM = (weight: number, reps: number): number => {
  return rmFormulas.epley(weight, reps)
}

const addSet = () => {
  newWorkout.value.sets.push({
    exercise: newWorkout.value.exercise,
    weight: 100,
    reps: 5,
    unit: 'kg' as DistanceUnit,
    rm1: 0,
    timestamp: 0
  })
}

const removeSet = (idx: number) => {
  if (newWorkout.value.sets.length > 1) {
    newWorkout.value.sets.splice(idx, 1)
  }
}

const saveWorkout = () => {
  if (!newWorkout.value.exercise.trim()) {
    alert('Please enter an exercise name')
    return
  }

  // Calculate 1RM for each set
  const setsWithRM = newWorkout.value.sets.map(set => ({
    ...set,
    exercise: newWorkout.value.exercise,
    rm1: estimateRM(set.weight, set.reps),
    timestamp: Date.now()
  }))

  const session: WorkoutSession = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    date: Date.now(),
    exercises: [
      {
        name: newWorkout.value.exercise,
        sets: setsWithRM
      }
    ],
    notes: newWorkout.value.notes
  }

  addWorkout(session)
  workouts.value = getWorkouts()

  // Reset form
  newWorkout.value = {
    exercise: '',
    sets: [{ exercise: '', weight: 100, reps: 5, unit: 'kg' as DistanceUnit, rm1: 0, timestamp: 0 }],
    notes: ''
  }

  showSaveMessage.value = true
  setTimeout(() => {
    showSaveMessage.value = false
  }, 3000)
}

const deleteWorkout = (id: string) => {
  if (confirm('Delete this workout?')) {
    deleteWorkoutStorage(id)
    workouts.value = getWorkouts()
  }
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
</style>
