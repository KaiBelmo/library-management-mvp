<template>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-6 border-[1.5px] border-stone-900 bg-stone-900 text-stone-50">
      <p class="text-[9px] font-black uppercase tracking-widest opacity-60">
        Registry Population
      </p>
      <p class="text-4xl font-serif italic mt-2">
        {{ stats.totalUsers }}
      </p>
    </div>

    <div class="p-6 border-[1.5px] border-stone-900 bg-white">
      <p class="text-[9px] font-black uppercase tracking-widest text-stone-400">
        Archived Volumes
      </p>
      <p class="text-4xl font-serif italic text-stone-900 mt-2">
        {{ stats.totalBooks }}
      </p>
    </div>

    <div class="p-6 border-[1.5px] border-stone-900 bg-white border-dashed">
      <p class="text-[9px] font-black uppercase tracking-widest text-stone-400">
        System Integrity
      </p>
      <p class="text-xs font-black text-emerald-600 mt-3 flex items-center gap-2">
        <span class="w-2 h-2 bg-emerald-600 animate-pulse rounded-full"></span>
        SECURE
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  stats: {
    totalBooks: number
    totalUsers: number
  }
}

defineProps<Props>()
</script>
