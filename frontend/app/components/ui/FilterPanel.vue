<template>
  <div class="bg-white p-8 border-[1.5px] border-stone-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)]">
    <div class="border-b border-stone-900 pb-4 flex items-center justify-between">
      <h3 class="font-serif text-xl text-stone-900 uppercase tracking-tighter italic">Backend Not Connected</h3>
      <div class="h-2 w-2 bg-stone-900"></div>
    </div>
    
    <div class="text-center py-8">
      <UIcon name="i-heroicons-funnel" class="w-12 h-12 text-stone-400 mx-auto mb-4" />
      <p class="text-sm text-stone-600">Filter functionality requires backend connection</p>
    </div>
  </div>
</template>

<script>
defineProps({
  filters: Object,
  genres: Array
})

defineEmits(['clear'])
</script>