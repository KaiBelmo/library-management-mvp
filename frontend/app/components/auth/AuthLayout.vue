<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-6 selection:bg-stone-900 selection:text-white">
    <div class="w-full max-w-md animate-fade-in">
      <div class="text-center mb-12">
        <div class="inline-flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-stone-900 bg-white text-stone-900 mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <UIcon :name="icon" class="h-6 w-6" />
        </div>
        <h1 class="font-serif text-4xl text-stone-900 italic tracking-tighter mb-2 leading-none">{{ title }}</h1>
        <p class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">{{ subtitle }}</p>
      </div>
      <div class="border-[1.5px] border-stone-900 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)] mb-14 relative">
        <div class="absolute top-0 left-0 w-full h-0.75 bg-stone-900"></div>
        <div class="p-8 md:p-10 space-y-8">
          <div v-if="error" class="p-4 border-[1.5px] border-red-600 bg-red-50 text-red-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
            <span>{{ error }}</span>
          </div>
          
          <div v-if="success" class="p-4 border-[1.5px] border-stone-900 bg-stone-50 text-stone-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
            <span>{{ success }}</span>
          </div>

          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  subtitle: string
  error?: string
  success?: string
}

defineProps<Props>()
</script>