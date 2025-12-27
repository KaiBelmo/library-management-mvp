<template>
  <section class="space-y-6">
    <div
      class="flex items-center justify-between border-b border-stone-200 pb-4 cursor-pointer hover:bg-stone-50 -mx-4 px-4 py-2 transition-all"
      @click="$emit('toggle-expanded')"
    >
      <h2 class="text-[10px] font-black uppercase tracking-widest text-stone-900">
        System Directory
      </h2>
      <div class="flex items-center gap-2">
        <span class="text-[9px] text-stone-400 font-mono italic">
          ACCESSING CORE_USERS...
        </span>
        <UIcon 
          :name="expanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" 
          class="w-4 h-4 text-black transition-transform"
        />
      </div>
    </div>

    <div v-if="expanded">
      <UserTable :all-users="users" />
    </div>
  </section>
</template>

<script setup lang="ts">
import UserTable from "~/components/ui/layout/UserTable.vue"

interface Props {
  users: any[]
  expanded: boolean
}

defineProps<Props>()
defineEmits<{
  'toggle-expanded': []
}>()
</script>
