<template>
  <div class="bg-white border-[1.5px] border-stone-900 rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)] overflow-hidden">
    <div class="border-b-[1.5px] border-stone-900 px-6 py-4 bg-stone-50">
      <h3 class="font-serif text-lg text-stone-900 uppercase tracking-widest italic">
        Public Annotations
      </h3>
    </div>
    
    <div class="p-6 text-center">
      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 text-stone-400 mx-auto mb-4" />
      <p class="text-sm text-stone-600">Comment functionality requires backend connection</p>
    </div>
  </div>
</template>

<script>
defineProps({
  loading: Boolean
})
</script>