<script setup lang="ts">
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
} = useFileUploader()

const handleFileChange = async (event: Event) => {
  const fileId = await handleUpload(event)
  if (fileId) {
    emit('update:modelValue', fileId)
  }
}
</script>

<template>
  <div class="space-y-2">
    <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-black">
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
          <span class="text-sm font-medium text-stone-900 uppercase tracking-tight">
            {{
              fileName || (modelValue ? 'Photo Uploaded' : 'Select Volume Cover')
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
      <NuxtImg
        :src="previewUrl"
        class="w-full aspect-[2/3] object-cover bg-stone-200"
        alt="Preview"
        width="128" 
        height="192"
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