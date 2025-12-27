<template>
  <div class="bg-white border-[1.5px] border-stone-900 rounded-none shadow-[16px_16px_0px_0px_rgba(0,0,0,0.02)] p-8 space-y-10">
    <div class="border-b border-stone-900 pb-4 flex items-center justify-between">
      <h3 class="font-serif text-xl text-stone-900 uppercase tracking-tighter italic">Refine Archive</h3>
      <div class="h-2 w-2 bg-stone-900"></div>
    </div>
    
    <div class="space-y-10">
      <div class="space-y-3 relative" ref="genreDropdownRef">
        <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-stone-900">Catalogue / Genre</label>
        
        <div 
          @click="isGenreOpen = !isGenreOpen"
          class="w-full border-b-[1.5px] border-stone-900 py-2 flex justify-between items-center cursor-pointer group"
        >
          <span class="text-sm font-medium text-stone-900 uppercase tracking-tight">
            {{ currentGenreLabel }}
          </span>
          <span class="text-[10px] transition-transform duration-200" :class="{ 'rotate-180': isGenreOpen }">▼</span>
        </div>

        <div 
          v-if="isGenreOpen"
          class="absolute z-50 w-full bg-white border-[1.5px] border-stone-900 mt-[-1.5px] max-h-[180px] overflow-y-auto custom-scrollbar shadow-xl"
        >
          <div 
            v-for="opt in genreOptions" 
            :key="opt.value"
            @click="selectGenre(opt.value)"
            class="px-4 py-3 text-sm font-medium uppercase tracking-tight text-stone-900 hover:bg-stone-900 hover:text-white cursor-pointer transition-colors"
          >
            {{ opt.label }}
          </div>
        </div>
      </div>
      
      <div class="space-y-3">
        <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-stone-900">Timeline Range</label>
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <span class="block text-[9px] font-bold text-stone-400 uppercase">From</span>
            <input
              type="date"
              :value="filters.dateFrom"
              @change="$emit('update:filters', { ...filters, dateFrom: ($event.target as HTMLInputElement).value })"
              class="w-full bg-transparent border-b border-stone-900/30 py-1 focus:outline-none focus:border-stone-900 text-xs font-medium text-stone-900"
            />
          </div>
          <div class="space-y-2">
            <span class="block text-[9px] font-bold text-stone-400 uppercase">To</span>
            <input
              type="date"
              :value="filters.dateTo"
              @change="$emit('update:filters', { ...filters, dateTo: ($event.target as HTMLInputElement).value })"
              class="w-full bg-transparent border-b border-stone-900/30 py-1 focus:outline-none focus:border-stone-900 text-xs font-medium text-stone-900"
            />
          </div>
        </div>
      </div>
      
      <div class="space-y-3">
        <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-stone-900">Organization / Sort</label>
        <div class="grid grid-cols-1 gap-4">
          <select
            :value="filters.sortBy"
            @change="$emit('update:filters', { ...filters, sortBy: ($event.target as HTMLSelectElement).value })"
            class="w-full bg-transparent border-b-[1.5px] border-stone-900 py-2 focus:outline-none text-sm font-medium text-stone-900 appearance-none uppercase tracking-tight"
          >
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
              BY: {{ opt.label }}
            </option>
          </select>
          <select
            :value="filters.sortOrder"
            @change="$emit('update:filters', { ...filters, sortOrder: ($event.target as HTMLSelectElement).value })"
            class="w-full bg-transparent border-b-[1.5px] border-stone-900 py-2 focus:outline-none text-sm font-medium text-stone-900 appearance-none uppercase tracking-tight"
          >
            <option v-for="opt in orderOptions" :key="opt.value" :value="opt.value">
              ORDER: {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
      
      <button
        @click="$emit('clear')"
        :disabled="!hasActiveFilters"
        class="w-full py-4 mt-4 border border-stone-900 text-[10px] text-black uppercase tracking-[0.4em] transition-all hover:bg-stone-900 hover:text-white disabled:opacity-20 disabled:grayscale"
      >
        Clear Parameters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

interface Props {
  filters: {
    search?: string;
    genre?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  };
  genres: string[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:filters', 'clear']);

// UI State
const isGenreOpen = ref(false);
const genreDropdownRef = ref<HTMLElement | null>(null);

// Best practice: Use VueUse to handle outside clicks. 
// This automatically handles SSR checks and unmounting cleanup.
onClickOutside(genreDropdownRef, () => {
  isGenreOpen.value = false;
});

const genreOptions = computed(() => [
  { label: 'ALL GENRES', value: '' },
  ...props.genres.map((genre: string) => ({ label: genre.toUpperCase(), value: genre }))
]);

const currentGenreLabel = computed(() => {
  const active = genreOptions.value.find((o: { label: string; value: string }) => o.value === props.filters.genre);
  return active ? active.label : 'ALL GENRES';
});

const sortOptions = [
  { label: 'TITLE', value: 'title' },
  { label: 'PUBLICATION DATE', value: 'publication_date' },
  { label: 'REGISTRY DATE', value: 'date_created' }
];

const orderOptions = [
  { label: 'ASCENDING', value: 'asc' },
  { label: 'DESCENDING', value: 'desc' }
];

const hasActiveFilters = computed(() => {
  if (!props.filters) return false;
  return !!(props.filters.search || props.filters.genre || props.filters.dateFrom || props.filters.dateTo);
});

function selectGenre(val: string) {
  emit('update:filters', { ...props.filters, genre: val || undefined });
  isGenreOpen.value = false;
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f5f5f4;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1c1917; 
  border-radius: 0px;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #1c1917 #f5f5f4;
}
</style>