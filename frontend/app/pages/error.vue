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
        
        <h2 class="text-[11px] font-black uppercase tracking-[0.5em] text-stone-900 mb-8">
          System Core Exception / Archive Halted
        </h2>
        
        <p class="text-sm font-medium text-stone-500 uppercase tracking-tight leading-relaxed mb-12 max-w-md mx-auto">
          {{ error?.message || 'The archive engine encountered a fatal internal conflict. Protocol restoration is required.' }}
        </p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <button 
            @click="handleError"
            class="flex items-center justify-center gap-3 py-4 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-800 transition-all border border-stone-900"
          >
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
            Reboot Session
          </button>
          
          <NuxtLink to="/">
            <button class="w-full py-4 bg-transparent text-stone-900 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-50 transition-all border border-stone-900">
              Emergency Exit
            </button>
          </NuxtLink>
        </div>
        
        <div v-if="isDev && error" class="mt-16 text-left border-t border-stone-100 pt-8">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 rounded-full bg-rose-500"></div>
            <h3 class="font-black text-[9px] uppercase tracking-widest text-stone-400">Archival Stack Trace (DEVELOPMENT)</h3>
          </div>
          <div class="bg-stone-950 p-6 overflow-auto border-l-4 border-rose-600 max-h-64">
            <pre class="font-mono text-[11px] text-stone-400 leading-relaxed">{{ JSON.stringify(error, null, 2) }}</pre>
          </div>
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