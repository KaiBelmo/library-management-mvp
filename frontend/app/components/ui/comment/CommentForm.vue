<template>
  <div class="bg-white border-[1.5px] border-stone-900 rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)] overflow-hidden">
    <div class="border-b-[1.5px] border-stone-900 px-6 py-4 bg-stone-50 flex justify-between items-center">
      <h3 class="font-serif text-lg text-stone-900 uppercase tracking-widest italic">
        Public Annotations
      </h3>
      <span class="text-[9px] font-black uppercase tracking-widest text-stone-400">
        Posting as: <span class="text-stone-900">{{ auth.fullName }}</span>
      </span>
    </div>
    
    <form @submit.prevent="onSubmit" class="p-6 space-y-8">
      <div class="group">
        <label class="block text-[9px] font-black uppercase tracking-[0.3em] text-stone-900 mb-2">
          Annotation Content
        </label>
        <textarea
          v-model="form.content"
          placeholder="SHARE YOUR THOUGHTS..."
          :rows="4"
          :disabled="loading"
          class="w-full bg-stone-50 border-[1.5px] border-stone-900 p-4 focus:outline-none focus:bg-white transition-all text-sm font-medium text-stone-900 placeholder:text-stone-300 resize-none leading-relaxed"
        />
      </div>
      
      <button
        type="submit"
        :disabled="!isValid || loading"
        class="w-full bg-stone-900 text-stone-50 py-4 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-stone-800 transition-all active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400"
      >
        {{ loading ? 'Transmitting...' : 'Commit Annotation' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: { content: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const auth = useAuthStore()

const form = reactive({
  content: ''
})

const isValid = computed(() => {
  return form.content.trim().length > 0
})

const onSubmit = () => {
  if (!isValid.value) return
  emit('submit', { content: form.content })
}

const resetForm = () => {
  form.content = ''
}

defineExpose({
  resetForm
})
</script>