<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    <div 
      v-for="i in count" 
      :key="i" 
      class="animate-pulse p-5 border border-stone-900/10 bg-stone-100/40 rounded-[2rem]"
    >
      <div class="relative aspect-[3/4] bg-stone-200 border-[1.5px] border-stone-900 shadow-[6px_6px_0px_0px_rgba(28,25,23,0.1)] rounded-2xl flex items-center justify-center">
        <UIcon name="i-heroicons-photo" class="w-12 h-12 text-stone-300" />
      </div>

      <div class="mt-8 space-y-4 px-2">
        <div class="space-y-2">
          <div class="h-6 bg-stone-300 w-3/4"></div>
          <div class="h-3 bg-stone-200 w-1/2"></div>
        </div>
        
        <div class="pt-4 border-t border-stone-200/60 flex justify-between items-center">
          <div class="h-6 bg-stone-200 border border-stone-900/10 w-20"></div>
          <div class="h-3 bg-stone-200 w-12"></div>
        </div>

        <div class="flex items-center gap-3 pt-1">
          <div class="h-2 w-2 rounded-full bg-stone-300"></div>
          <div class="h-2 bg-stone-200 w-16"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
defineProps({
  count: {
    type: Number,
    default: 6
  }
})
</script>