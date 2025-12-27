<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-rose-600 selection:text-white">
    <div class="text-center max-w-2xl w-full border-[1.5px] border-stone-900 p-8 md:p-16 bg-white shadow-[40px_40px_0px_0px_rgba(0,0,0,0.04)] relative">
      
      <div class="absolute top-0 left-0 w-full h-1 bg-rose-600"></div>

      <div class="relative z-10">
        <div class="mb-10 inline-flex items-center justify-center w-16 h-16 border-[1.5px] border-stone-900 bg-stone-50">
          <UIcon name="i-heroicons-cpu-chip" class="w-8 h-8 text-stone-900" />
        </div>
        
        <h1 class="font-serif text-9xl text-stone-900 italic tracking-tighter mb-4 leading-none">
          {{ error?.statusCode || 500 }}
        </h1>
        
        <p class="text-sm font-medium text-stone-500 uppercase tracking-tight leading-relaxed mb-12 max-w-md mx-auto">
          {{ error?.message || 'The archive engine encountered a fatal internal conflict. Protocol restoration is required.' }}
        </p>

        <button
          @click="handleError"
          class="px-8 py-3 border-2 border-stone-900 bg-white text-stone-900 text-sm font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
        >
          Return to Safety
        </button>

        <div v-if="isDev" class="mt-8 p-4 bg-stone-100 text-left text-xs text-stone-600">
          <p class="font-mono">Error details (visible in development):</p>
          <pre class="mt-2 overflow-auto max-h-48">{{ error }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from 'nuxt/app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()
const isDev = process.dev

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>