<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
      @click.self="onCancel"
    >
      <div class="bg-white border-[1.5px] border-stone-900 w-full max-w-md shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
        
        <div class="border-b-[1.5px] border-stone-900 px-6 py-4 bg-stone-50">
          <h3 class="font-serif text-lg text-stone-900 uppercase tracking-widest italic">
            {{ title }}
          </h3>
        </div>

        <div class="p-8">
          <p class="text-xs font-medium text-stone-600 leading-relaxed uppercase tracking-tight">
            {{ message }}
          </p>
        </div>

        <div class="flex border-t-[1.5px] border-stone-900">
          <button 
            type="button"
            @click="onCancel"
            class="flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-colors border-r-[1.5px] border-stone-900"
          >
            Cancel
          </button>
          <button 
            type="button"
            @click="onConfirm"
            :disabled="loading"
            class="flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] bg-stone-900 text-stone-50 hover:bg-rose-600 transition-all disabled:bg-stone-200"
          >
            {{ loading ? 'Processing...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  confirmColor?: 'error' | 'primary'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'System Notice',
  message: 'Verification required for this transaction.',
  confirmText: 'Acknowledge',
  confirmColor: 'primary'
})

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('update:isOpen', false)
  emit('cancel')
}
</script>