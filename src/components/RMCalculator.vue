<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      1RM Calculator
    </h1>

    <!-- Input Section -->
    <div class="card">
      <div class="grid md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm text-gray-400 mb-2 font-semibold">Weight Lifted</label>
          <input 
            v-model.number="weight" 
            type="number" 
            step="0.5" 
            class="input-field w-full"
            placeholder="e.g., 100"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-2 font-semibold">Reps Done</label>
          <input 
            v-model.number="reps" 
            type="number" 
            min="1"
            max="50"
            class="input-field w-full"
            placeholder="1-50"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-2 font-semibold">Unit</label>
          <select v-model="unit" class="input-field w-full">
            <option value="kg">Kilograms (kg)</option>
            <option value="lbs">Pounds (lbs)</option>
          </select>
        </div>
        <button @click="calculateRM" class="btn-primary w-full py-3">
          Calculate
        </button>
      </div>
    </div>

    <!-- Results Grid -->
    <div v-if="results.length > 0" class="space-y-4 animate-fade-in">
      <h2 class="text-2xl font-bold text-green-400 mb-4">Estimated 1RM by Formula</h2>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="(result, idx) in results"
          :key="idx"
          class="card relative overflow-hidden group hover:border-red-500 cursor-pointer transition-all"
          @click="selectedFormula = selectedFormula === result.name ? null : result.name"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/20 transition-all pointer-events-none"></div>
          
          <h3 class="font-bold text-lg mb-2 relative z-10">{{ result.name }}</h3>
          <p class="text-sm text-gray-400 mb-3 relative z-10">Estimated 1RM</p>
          
          <div class="relative z-10 flex items-baseline gap-2">
            <span class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {{ result.rm.toFixed(1) }}
            </span>
            <span class="text-gray-400">{{ unit }}</span>
          </div>

          <div v-if="selectedFormula === result.name" class="mt-4 pt-4 border-t border-gray-700 relative z-10">
            <p class="text-xs text-gray-500 mb-2">About this formula</p>
            <button 
              @click.stop="logWorkout(result)"
              class="btn-secondary text-sm w-full"
            >
              Log Workout
            </button>
          </div>
        </div>
      </div>

      <!-- Average -->
      <div class="card bg-gradient-to-r from-green-900/30 to-cyan-900/30 border-green-600">
        <p class="text-gray-400 text-sm mb-2">Average 1RM</p>
        <p class="text-4xl font-bold text-green-400">
          {{ averageRM.toFixed(1) }} <span class="text-lg text-gray-400">{{ unit }}</span>
        </p>
      </div>
    </div>

    <!-- Info Section -->
    <div v-else class="card text-center py-12 opacity-75">
      <p class="text-lg text-gray-400 mb-2">Enter weight and reps to calculate estimated 1RM</p>
      <p class="text-sm text-gray-500">Supports: Epley, Brzycki, McGlothin, Lombardi, Mayhew, O'Conner, Wathen</p>
    </div>

    <!-- Success Message -->
    <transition name="fade">
      <div v-if="showLogMessage" class="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg animate-fade-in">
        Workout logged successfully!
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DistanceUnit } from '../types'
import { formulaList, calculateAverage1RM, roundToTwo } from '../utils/calculations'
import { useStorage } from '../utils/storage'

const { addWorkout } = useStorage()

const weight = ref(100)
const reps = ref(5)
const unit = ref<DistanceUnit>('kg')
const results = ref<Array<{ name: string; rm: number }>>([])
const selectedFormula = ref<string | null>(null)
const showLogMessage = ref(false)

const averageRM = computed(() => {
  if (results.value.length === 0) return 0
  return calculateAverage1RM(results.value.map(r => r.rm))
})

const calculateRM = () => {
  if (weight.value <= 0 || reps.value <= 0) return

  results.value = formulaList.map(formula => ({
    name: formula.name,
    rm: roundToTwo(formula.calculate(weight.value, reps.value))
  }))
}

const logWorkout = (result: { name: string; rm: number }) => {
  const session = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    date: Date.now(),
    exercises: [
      {
        name: 'Unknown Exercise',
        sets: [
          {
            exercise: 'Unknown Exercise',
            weight: weight.value,
            reps: reps.value,
            unit: unit.value,
            rm1: result.rm,
            timestamp: Date.now()
          }
        ]
      }
    ]
  }

  addWorkout(session)
  showLogMessage.value = true
  setTimeout(() => {
    showLogMessage.value = false
  }, 3000)
}
</script>

<style scoped>
</style>
