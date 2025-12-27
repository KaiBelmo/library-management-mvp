<template>
  <div>
    <label 
      class="block text-[10px] font-black uppercase tracking-[0.4em] mb-3" 
      :class="error ? 'text-red-500' : 'text-stone-400'"
    >
      {{ label }}
    </label>
    <UInput
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      size="lg"
      variant="none"
      class="w-full border-b-[1.5px] transition-colors rounded-none px-0 py-2"
      :class="error ? 'border-red-500' : 'border-stone-100 focus:border-stone-900'"
      :ui="{ base: '!text-black placeholder:!text-stone-400' }"
      v-bind="$attrs"
    />
    <p v-if="error" class="text-red-600 text-[9px] font-black uppercase mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ 
  modelValue: string; 
  label: string; 
  placeholder?: string;
  error?: string; 
  type?: string;
  disabled?: boolean;
}>(), {
  placeholder: '',
  type: 'text',
  error: '',
  disabled: false
})

defineEmits(['update:modelValue'])
</script>