<template>
  <div 
    class="group relative flex flex-col cursor-pointer transition-all duration-500 rounded-4xl p-5 border border-stone-900/5 bg-stone-100/40 hover:bg-stone-100 hover:border-stone-900/10 shadow-sm"
    @click="$emit('click', book.id)"
  >
    <div class="relative aspect-3/4 overflow-hidden rounded-2xl bg-stone-200 border-[1.5px] transition-all duration-500 group-hover:shadow-[3px_3px_0px_0px_rgba(0,0,5,1)] group-hover:-translate-y-1">
      
      <img
        v-if="book.image"
        :src="book.image"
        :alt="book.title"
        class="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        loading="lazy"
      />
      
      <div
        v-else
        class="flex h-full w-full flex-col items-center justify-center bg-stone-200"
      >
        <UIcon name="i-heroicons-book-open" class="h-14 w-14 text-stone-900/20" />
      </div>
    </div>

    <div class="mt-8 space-y-4 px-2 pb-2">
      <div class="space-y-1">
        <div class="flex justify-between items-start gap-4">
          <h3 class="font-serif text-xl leading-tight text-stone-900 line-clamp-2 group-hover:text-stone-700 transition-colors">
            {{ book.title }}
          </h3>
        </div>
        <p class="text-xs font-bold tracking-[0.15em] text-stone-400 uppercase">
          {{ book.author }}
        </p>
      </div>
      
      <div class="flex items-center justify-between pt-4 border-t border-stone-200/60">
        <span class="text-[10px] font-black py-1 px-3 border-1.5 border-stone-900 uppercase tracking-widest text-stone-900 bg-white">
          {{ book.genre }}
        </span>
        <span class="text-xs font-serif italic text-stone-500">
          Vol. {{ publicationYear }}
        </span>
      </div>

      <div class="flex items-center gap-3 pt-1">
        <div class="h-2 w-2 rounded-full bg-stone-900 animate-pulse"></div>
        <span class="text-[10px] font-bold text-stone-900 uppercase tracking-[0.25em]">Available</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/schemas'

interface Props {
  book: Book
}

interface Emits {
  (e: 'click', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const publicationYear = computed(() => {
  if (!props.book.publication_date) return '—'
  return new Date(props.book.publication_date).getFullYear()
})
</script>