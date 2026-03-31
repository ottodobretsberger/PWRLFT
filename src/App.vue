<template>
  <div class="min-h-screen bg-dark-bg text-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-gunmetal border-b border-gray-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="text-3xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 bg-clip-text text-transparent">
              PWRLFT
            </div>
          </div>
          <nav class="hidden md:flex gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
        <!-- Mobile nav -->
        <div class="md:hidden mt-4 grid grid-cols-4 gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-2 py-2 rounded text-sm font-semibold transition-all',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                : 'bg-gray-800 text-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="animate-fade-in">
        <InventoryManager v-if="activeTab === 'inventory'" />
        <BarLoader v-else-if="activeTab === 'loader'" />
        <RMCalculator v-else-if="activeTab === 'calculator'" />
        <WorkoutLogger v-else-if="activeTab === 'workouts'" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InventoryManager from './components/InventoryManager.vue'
import BarLoader from './components/BarLoader.vue'
import RMCalculator from './components/RMCalculator.vue'
import WorkoutLogger from './components/WorkoutLogger.vue'

const activeTab = ref('inventory')

const tabs = [
  { id: 'inventory', label: 'Inventory' },
  { id: 'loader', label: 'Loader' },
  { id: 'calculator', label: '1RM' },
  { id: 'workouts', label: 'Workouts' }
]
</script>

<style scoped>
</style>
