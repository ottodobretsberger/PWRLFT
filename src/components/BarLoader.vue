<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
      Bar Loader Calculator
    </h1>

    <!-- Input Section -->
    <div class="card">
      <div class="grid md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm text-gray-400 mb-2 font-semibold">Total Weight</label>
          <input 
            v-model.number="targetWeight" 
            type="number" 
            step="0.5" 
            class="input-field w-full text-lg"
            placeholder="Enter target weight"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-2 font-semibold">Unit</label>
          <select v-model="selectedUnit" class="input-field w-full">
            <option value="kg">Kilograms (kg)</option>
            <option value="lbs">Pounds (lbs)</option>
          </select>
        </div>
        <label class="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 h-[50px]">
          <input
            v-model="useCollars"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-500 bg-gray-800 text-red-500 focus:ring-red-500"
          />
          <span class="text-sm font-semibold text-gray-300">Use collars</span>
        </label>
        <button @click="calculateLoad" class="btn-primary w-full py-3">
          Calculate Load
        </button>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="result" class="space-y-6 animate-fade-in">
      <!-- Weight Conversion -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-3 text-green-400">Weight Info</h3>
        <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p class="text-gray-400 text-sm">Entered Weight</p>
            <p class="text-2xl font-bold text-white">{{ targetWeight }} {{ selectedUnit }}</p>
          </div>
          <div class="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p class="text-gray-400 text-sm">Converted</p>
            <p class="text-2xl font-bold text-cyan-400">
              {{ convertedWeight.toFixed(2) }} {{ selectedUnit === 'kg' ? 'lbs' : 'kg' }}
            </p>
          </div>
          <div class="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p class="text-gray-400 text-sm">{{ baseWeightLabel }}</p>
            <p class="text-2xl font-bold text-orange-400">{{ baseWeight.toFixed(2) }} {{ selectedUnit }}</p>
          </div>
          <div class="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p class="text-gray-400 text-sm">Target Per Side</p>
            <p class="text-2xl font-bold text-violet-400">{{ plateWeightPerSide.toFixed(2) }} {{ selectedUnit }}</p>
          </div>
        </div>
      </div>

      <!-- Plate Breakdown -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4 text-red-400">Plates to Load</h3>
        <div v-if="result.plates.length > 0" class="space-y-3">
          <div 
            v-for="(plateInfo, idx) in result.plates" 
            :key="idx"
            class="flex items-center justify-between bg-gray-900 p-4 rounded-lg border-l-4 animate-slide-in"
            :style="{ borderColor: plateInfo.color }"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-8 h-8 rounded-full shadow-lg" 
                :style="{ backgroundColor: plateInfo.color }"
              ></div>
              <div>
                <p class="font-bold text-lg">{{ plateInfo.weight }} {{ selectedUnit }}</p>
                <p class="text-sm text-gray-400">{{ plateInfo.side }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-yellow-400">{{ plateInfo.quantity }}x</p>
            </div>
          </div>

          <!-- Summary -->
          <div class="mt-6 pt-4 border-t border-gray-700">
            <p class="text-sm text-gray-400 mb-2">Plate Weight Per Side</p>
            <p class="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {{ (result.totalLoaded).toFixed(2) }} {{ selectedUnit }}
            </p>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p class="text-lg mb-2">Cannot load this weight</p>
          <p class="text-sm">Check your available matched pairs or base bar and collar weight.</p>
        </div>
      </div>

      <div v-if="result.plates.length > 0" class="card overflow-hidden">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h3 class="text-lg font-semibold text-cyan-400">Visual Loading Guide</h3>
          <p class="text-sm text-gray-400">Single-side view from sleeve outward</p>
        </div>

        <div class="rounded-xl border border-gray-700 bg-gradient-to-b from-gray-950 to-gray-900 p-4 md:p-6">
          <div class="pb-2">
            <div class="single-side-guide">
              <div class="barbell-shaft single-side-shaft"></div>
              <div class="single-side-stack" :style="stackScaleStyle">
                <div class="barbell-sleeve"></div>
                <div
                  v-for="(plate, idx) in visualPlateStackRight"
                  :key="`right-${idx}-${plate.weight}`"
                  class="barbell-plate"
                  :class="[
                    plate.color === '#111827' ? 'barbell-plate-dark' : '',
                    plate.weight <= 2.5 ? 'barbell-plate-compact' : '',
                    plate.weight <= 1.25 ? 'barbell-plate-micro' : ''
                  ]"
                  :style="getPlateStyle(plate.weight, plate.color)"
                >
                  <div class="barbell-plate-face">
                    <span class="barbell-plate-mark barbell-plate-mark-top">{{ plateUnitLabel }}</span>
                    <span class="barbell-plate-label">{{ formatPlateLabel(plate.weight) }}</span>
                    <span class="barbell-plate-mark barbell-plate-mark-bottom">{{ plateUnitLabel }}</span>
                    <span class="barbell-plate-hub"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <div
              v-for="(plate, idx) in result.plates"
              :key="`legend-${idx}-${plate.weight}`"
              class="rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2"
            >
              <div class="flex items-center gap-2">
                <span class="inline-block h-4 w-4 rounded-full border border-white/20" :style="{ backgroundColor: plate.color }"></span>
                <span class="font-semibold text-white">{{ plate.weight }} {{ selectedUnit }}</span>
              </div>
              <p class="mt-1 text-xs text-gray-400">{{ plate.quantity }} per side</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Initial State -->
    <div v-else class="card text-center py-12 opacity-75">
      <p class="text-2xl text-gray-400">Enter a weight and click "Calculate Load" to get started</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { LoaderResult, DistanceUnit } from '../types'
import { useStorage } from '../utils/storage'
import { convertWeight } from '../utils/calculations'

const { getInventory } = useStorage()
const inventory = ref(getInventory())

const targetWeight = ref(100)
const selectedUnit = ref<DistanceUnit>('kg')
const useCollars = ref(true)
const result = ref<LoaderResult | null>(null)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth
}

const widthMap: Record<number, number> = {
  0.5: 6,
  1.25: 8,
  2.5: 10,
  5: 12,
  10: 15,
  15: 18,
  20: 20,
  25: 22,
  35: 18,
  45: 20
}

const heightMap: Record<number, number> = {
  0.5: 58,
  1.25: 74,
  2.5: 92,
  5: 118,
  10: 152,
  15: 152,
  20: 152,
  25: 152,
  35: 144,
  45: 152
}

const activePlates = computed(() => {
  return selectedUnit.value === 'kg' ? inventory.value.kiloPlates : inventory.value.poundPlates
})

const baseWeight = computed(() => {
  const barWeight = selectedUnit.value === 'kg' ? inventory.value.barWeight.kg : inventory.value.barWeight.lbs
  const collarWeight = selectedUnit.value === 'kg' ? inventory.value.collarWeight.kg : inventory.value.collarWeight.lbs
  return barWeight + (useCollars.value ? collarWeight * 2 : 0)
})

const baseWeightLabel = computed(() => (useCollars.value ? 'Bar + Collars' : 'Bar Only'))

const plateWeightPerSide = computed(() => {
  return Math.max((targetWeight.value - baseWeight.value) / 2, 0)
})

const convertedWeight = computed(() => {
  return convertWeight(targetWeight.value, selectedUnit.value, selectedUnit.value === 'kg' ? 'lbs' : 'kg')
})

const plateUnitLabel = computed(() => (selectedUnit.value === 'kg' ? 'KG' : 'LB'))

const visualPlateStack = computed(() => {
  if (!result.value) {
    return [] as Array<{ weight: number; color: string }>
  }

  return result.value.plates.flatMap((plate) =>
    Array.from({ length: plate.quantity }, () => ({
      weight: plate.weight,
      color: plate.color
    }))
  )
})

const visualPlateStackRight = computed(() => [...visualPlateStack.value])

const estimatedStackWidth = computed(() => {
  const sleeveWidth = viewportWidth.value < 900 ? 28 : 38
  return visualPlateStackRight.value.reduce((total, plate) => total + (widthMap[plate.weight] ?? 18) + 2, sleeveWidth)
})

const stackScale = computed(() => {
  const targetMaxWidth = viewportWidth.value < 640 ? 205 : viewportWidth.value < 900 ? 250 : 360
  const rawScale = targetMaxWidth / estimatedStackWidth.value
  return Math.max(0.55, Math.min(1, rawScale))
})

const stackScaleStyle = computed(() => ({
  transform: `scale(${stackScale.value})`,
  transformOrigin: 'left center'
}))

const formatPlateLabel = (weight: number) => {
  return Number.isInteger(weight) ? weight.toFixed(0) : weight.toString()
}

const getPlateStyle = (weight: number, color: string) => {
  return {
    backgroundColor: color,
    width: `${widthMap[weight] ?? 18}px`,
    height: `${heightMap[weight] ?? 120}px`
  }
}

const findPlateCombination = (
  plates: Array<{ weight: number; quantity: number; color: string }>,
  targetPerSide: number,
  index = 0
): Array<{ weight: number; quantity: number; color: string }> | null => {
  if (Math.abs(targetPerSide) < 0.01) {
    return []
  }

  if (index >= plates.length) {
    return null
  }

  const plate = plates[index]
  const maxPairs = Math.min(Math.floor(plate.quantity / 2), Math.floor((targetPerSide + 0.01) / plate.weight))

  for (let pairs = maxPairs; pairs >= 0; pairs -= 1) {
    const remainder = Number((targetPerSide - plate.weight * pairs).toFixed(2))
    if (remainder < -0.01) {
      continue
    }

    const next = findPlateCombination(plates, remainder, index + 1)
    if (next) {
      return pairs > 0
        ? [{ weight: plate.weight, quantity: pairs, color: plate.color }, ...next]
        : next
    }
  }

  return null
}

const calculateLoad = () => {
  inventory.value = getInventory()
  const plates = [...activePlates.value].sort((a, b) => b.weight - a.weight)
  const weightPerSide = plateWeightPerSide.value

  if (weightPerSide < 0) {
    result.value = { plates: [], totalLoaded: 0, unit: selectedUnit.value }
    return
  }

  const platesNeeded = findPlateCombination(plates, weightPerSide)

  if (!platesNeeded) {
    result.value = { plates: [], totalLoaded: 0, unit: selectedUnit.value }
    return
  }

  const plateResults = platesNeeded.map(p => ({
    weight: p.weight,
    quantity: p.quantity,
    color: p.color,
    side: 'each side' as const
  }))

  result.value = {
    plates: plateResults,
    totalLoaded: weightPerSide,
    unit: selectedUnit.value
  }
}

watch(() => selectedUnit.value, () => {
  result.value = null
})

watch(() => useCollars.value, () => {
  result.value = null
})

onMounted(() => {
  window.addEventListener('resize', updateViewportWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportWidth)
})
</script>

<style scoped>
.single-side-guide {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 220px;
}

.barbell-shaft {
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #6b7280 0%, #d1d5db 18%, #9ca3af 50%, #d1d5db 82%, #6b7280 100%);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.15), 0 0 20px rgba(148, 163, 184, 0.15);
}

.single-side-shaft {
  flex: 1 1 auto;
  min-width: 140px;
}

.single-side-stack {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  min-height: 180px;
}

.barbell-sleeve {
  width: 38px;
  height: 26px;
  border-radius: 8px;
  background: linear-gradient(180deg, #4b5563 0%, #9ca3af 50%, #374151 100%);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.15);
}

.barbell-plate {
  position: relative;
  margin: 0 1px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.05), 0 8px 18px rgba(0, 0, 0, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.barbell-plate::before {
  content: '';
  position: absolute;
  inset: 4px 1px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
}

.barbell-plate::after {
  content: '';
  position: absolute;
  inset: 14px 3px;
  border-radius: 7px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.06));
}

.barbell-plate-dark {
  border-color: rgba(148, 163, 184, 0.45);
}

.barbell-plate:nth-child(3n) {
  transform: translateY(-1px);
}

.barbell-plate-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.barbell-plate-hub {
  position: absolute;
  width: 54%;
  aspect-ratio: 1;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.22);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(15, 23, 42, 0.3) 46%, rgba(15, 23, 42, 0.02) 47%, transparent 50%);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.14);
}

.barbell-plate-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.96);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  z-index: 1;
}

.barbell-plate-mark {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.48rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.72);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.barbell-plate-mark-top {
  top: 10px;
}

.barbell-plate-mark-bottom {
  bottom: 10px;
}

.barbell-plate-compact .barbell-plate-hub {
  width: 62%;
}

.barbell-plate-compact .barbell-plate-label {
  font-size: 0.64rem;
  letter-spacing: 0.02em;
}

.barbell-plate-compact .barbell-plate-mark {
  font-size: 0.4rem;
  letter-spacing: 0.1em;
}

.barbell-plate-micro .barbell-plate-hub {
  width: 68%;
}

.barbell-plate-micro .barbell-plate-mark {
  display: none;
}

.barbell-plate-micro .barbell-plate-label {
  font-size: 0.52rem;
}

@media (max-width: 900px) {
  .single-side-guide {
    min-height: 170px;
  }

  .single-side-shaft {
    min-width: 72px;
  }

  .barbell-sleeve {
    width: 28px;
    height: 22px;
  }

  .barbell-plate {
    min-height: 58px;
  }

  .barbell-plate-label {
    font-size: 0.72rem;
  }

  .barbell-plate-mark {
    font-size: 0.42rem;
  }
}
</style>
