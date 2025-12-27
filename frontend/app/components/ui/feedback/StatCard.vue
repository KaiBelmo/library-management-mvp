<template>
  <div class="bg-white p-10 space-y-4">
    <p
      class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400"
    >
      {{ label }}
    </p>

    <div class="text-6xl font-serif italic text-stone-900">
      {{ value }}
    </div>

    <p class="text-xs font-bold text-stone-900 uppercase tracking-widest">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: number | string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: 'Verified Records',
})
</script>
