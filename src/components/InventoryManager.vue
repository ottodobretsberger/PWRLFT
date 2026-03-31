<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
        Plate Inventory
      </h1>
      <button @click="saveData" class="btn-primary flex items-center gap-2">
        Save
      </button>
    </div>

    <!-- Bar & Collar Weight -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="text-xl font-semibold mb-4 text-yellow-400">Barbell Weight</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Kilograms</label>
            <input v-model.number="inventory.barWeight.kg" type="number" step="0.1" class="input-field w-full" placeholder="e.g., 20" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Pounds</label>
            <input v-model.number="inventory.barWeight.lbs" type="number" step="0.1" class="input-field w-full" placeholder="e.g., 45" />
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-xl font-semibold mb-4 text-yellow-400">Collar Weight</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Kilograms (combined collar weight)</label>
            <input v-model.number="inventory.collarWeight.kg" type="number" step="0.1" class="input-field w-full" placeholder="e.g., 2.5" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Pounds (combined collar weight)</label>
            <input v-model.number="inventory.collarWeight.lbs" type="number" step="0.1" class="input-field w-full" placeholder="e.g., 5.5" />
          </div>
        </div>
      </div>
    </div>

    <!-- Kilo Plates -->
    <div class="card">
      <h3 class="text-2xl font-bold mb-4 text-cyan-400">Kilogram Plates</h3>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(plate, idx) in inventory.kiloPlates" :key="idx" class="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 rounded-full" :style="{ backgroundColor: plate.color }"></div>
            <span class="font-bold text-lg">{{ plate.weight }} kg</span>
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-400">Total plates</label>
            <input v-model.number="plate.quantity" type="number" min="0" class="input-field w-full" />
            <p class="text-xs text-gray-500">Available pairs: {{ Math.floor(plate.quantity / 2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pound Plates -->
    <div class="card">
      <h3 class="text-2xl font-bold mb-4 text-orange-400">Pound Plates</h3>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(plate, idx) in inventory.poundPlates" :key="idx" class="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 rounded-full" :style="{ backgroundColor: plate.color }"></div>
            <span class="font-bold text-lg">{{ plate.weight }} lbs</span>
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-400">Total plates</label>
            <input v-model.number="plate.quantity" type="number" min="0" class="input-field w-full" />
            <p class="text-xs text-gray-500">Available pairs: {{ Math.floor(plate.quantity / 2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Status -->
    <transition name="fade">
      <div v-if="showSaveMessage" class="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg animate-fade-in">
        Inventory saved successfully!
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Inventory } from '../types'
import { useStorage } from '../utils/storage'

const { getInventory, saveInventory } = useStorage()
const inventory = ref<Inventory>(getInventory())
const showSaveMessage = ref(false)

const saveData = () => {
  saveInventory(inventory.value)
  showSaveMessage.value = true
  setTimeout(() => {
    showSaveMessage.value = false
  }, 3000)
}

watch(inventory, saveData, { deep: true, immediate: false })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
