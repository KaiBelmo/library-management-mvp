<template>
  <header class="border-b-[1.5px] border-stone-900 pb-12">
    <div class="flex flex-col md:flex-row justify-between items-end gap-8">
      <div class="space-y-4">
        <p class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">
          Registry Personnel
          {{ isAdmin ? "— Level 5 Clearance" : "" }}
        </p>
        <h1 class="font-serif text-5xl md:text-6xl text-stone-900 italic tracking-tighter leading-none">
          Personnel Dossier
        </h1>
      </div>

      <button
        @click="$emit('logout')"
        class="group flex items-center gap-2 px-6 py-3 border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest text-stone-900 hover:bg-rose-600 hover:text-white transition-all"
      >
        Terminate Session
        <UIcon name="i-heroicons-power" class="w-3 h-3" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  isAdmin: boolean
}

defineProps<Props>()
defineEmits<{
  logout: []
}>()
</script>
