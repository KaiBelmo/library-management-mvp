<template>
  <UModal 
    :model-value="isOpen" 
    @update:model-value="$emit('update:isOpen', $event)"
    :ui="{
      wrapper: 'flex items-center justify-center',
      content: 'rounded-none border-[1.5px] border-stone-900 shadow-[24px_24px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden bg-white'
    }"
  >
    <div class="bg-white">
      <div class="border-b-[1.5px] border-stone-900 p-6 bg-stone-50">
        <h3 class="font-serif text-xl text-stone-900 uppercase tracking-tighter italic">
          {{ title }}
        </h3>
      </div>
      
      <div class="p-8">
        <p class="text-sm font-medium text-stone-900 leading-relaxed uppercase tracking-tight">
          {{ message }}
        </p>
      </div>
      
      <div class="grid grid-cols-2 border-t-[1.5px] border-stone-900">
        <button
          @click="onCancel"
          :disabled="loading"
          class="py-4 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all border-r-[1.5px] border-stone-900 disabled:opacity-50"
        >
          Cancel
        </button>
        
        <button
          @click="onConfirm"
          :disabled="loading"
          :class="[
            'py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all disabled:bg-stone-200',
            confirmColor === 'error' 
              ? 'bg-rose-600 text-white hover:bg-rose-700' 
              : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
          ]"
        >
          {{ loading ? 'Processing...' : confirmText }}
        </button>
      </div>
    </div>
  </UModal>
</template>

<script>
defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  confirmText: String,
  confirmColor: String,
  loading: Boolean
})

defineEmits(['update:isOpen', 'confirm', 'cancel'])

const onConfirm = () => {
  // Confirm functionality disabled
}

const onCancel = () => {
  emit('update:isOpen', false)
  emit('cancel')
}
</script>