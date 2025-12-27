<template>
  <div class="relative group">
    <UIcon 
      name="i-heroicons-magnifying-glass" 
      class="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-900 transition-transform duration-300 group-focus-within:scale-110" 
    />
    
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder?.toUpperCase()"
      class="w-full bg-transparent border-b-2 text-black border-stone-900 pl-10 py-5 text-lg font-medium placeholder:text-stone-300 focus:outline-none transition-colors uppercase tracking-tight"
      autocomplete="off"
      :aria-label="placeholder"
      @keydown.enter="$emit('search')"
    />

  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Search the collection...'
})
defineEmits<Emits>()
</script>