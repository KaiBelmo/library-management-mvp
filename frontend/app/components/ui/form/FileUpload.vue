<script setup lang="ts">
import { useFileUpload } from '~/composables/useFileUpload'

const props = defineProps<{
  label: string
  modelValue?: string | null
  accept?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const { 
  fileInput,
  fileName,
  previewUrl,
  errorMessage,
  pending,
  handleFileChange: handleUpload
} = useFileUpload()

const handleFileChange = async (event: Event) => {
  const fileId = await handleUpload(event)
  emit('update:modelValue', fileId)
}
</script>


<template>
  <div class="space-y-2">
    <label
      class="block text-[10px] font-black uppercase tracking-[0.25em] text-black"
    >
      {{ label }}
    </label>

    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :accept="accept"
      :disabled="pending"
      @change="handleFileChange"
    />

    <div
      @click="!pending && fileInput?.click()"
      class="w-full border-b-[1.5px] border-stone-900 py-4 cursor-pointer group transition-colors"
      :class="{ 'opacity-50 cursor-not-allowed': pending }"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon
            :name="pending ? 'i-heroicons-arrow-path' : 'i-heroicons-photo'"
            class="w-5 h-5 text-stone-900"
            :class="{ 'animate-spin': pending }"
          />
          <span
            class="text-sm font-medium text-stone-900 uppercase tracking-tight"
          >
            {{
              fileName ||
              (modelValue ? 'Photo Uploaded' : 'Select Volume Cover')
            }}
          </span>
        </div>

        <UIcon
          name="i-heroicons-arrow-up-tray"
          class="w-4 h-4 text-stone-900 group-hover:-translate-y-1 transition-transform"
        />
      </div>
    </div>

    <div
      v-if="previewUrl"
      class="mt-4 border-[1.5px] border-stone-900 p-2 w-32 bg-stone-50"
    >
      <img
        :src="previewUrl"
        class="w-full aspect-[3/4] object-cover"
        alt="Preview"
      />
    </div>

    <p
      v-if="errorMessage"
      class="text-[9px] text-rose-600 uppercase tracking-widest mt-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
