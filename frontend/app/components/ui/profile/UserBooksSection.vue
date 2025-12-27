<template>
  <section class="space-y-6">
    <div
      class="flex items-center justify-between border-b border-stone-200 pb-4 cursor-pointer hover:bg-stone-50 -mx-4 px-4 py-2 transition-all"
      @click="$emit('toggle-expanded')"
    >
      <h2 class="text-[10px] font-black uppercase tracking-widest text-stone-900">
        Your Archived Volumes
      </h2>
      <div class="flex items-center gap-2">
        <span class="text-[9px] text-stone-400 font-mono italic">
          {{ pagination.total }} TOTAL ENTRIES
        </span>
        <UIcon 
          :name="expanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" 
          class="w-4 h-4 text-black transition-transform"
        />
      </div>
    </div>

    <div v-if="expanded" class="space-y-6">
      <div v-if="loading" class="text-center py-12">
        <p class="text-[10px] font-black uppercase tracking-widest text-stone-400">
          LOADING ARCHIVE...
        </p>
      </div>

      <div v-else-if="books.length === 0" class="text-center py-12 border-[1.5px] border-dashed border-stone-300">
        <p class="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">
          NO VOLUMES IN YOUR ARCHIVE
        </p>
        <NuxtLink to="/books/new">
          <button
            class="px-6 py-3 border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest text-stone-900 hover:bg-stone-900 hover:text-white transition-all"
          >
            Register First Volume
          </button>
        </NuxtLink>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BookCard
            v-for="book in books"
            :key="book.id"
            :book="book"
            @click="$emit('navigate-book', book.id)"
          />
        </div>

        <!-- Pagination Controls -->
        <div v-if="pagination.totalPages > 1" class="flex justify-center items-center gap-4 mt-12">
          <button
            @click="$emit('set-page', pagination.page - 1)"
            :disabled="pagination.page === 1 || paginating"
            class="px-4 py-2 border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest text-stone-900 hover:bg-stone-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Previous
          </button>

          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono text-stone-400">
              Page {{ pagination.page }} of {{ pagination.totalPages }}
            </span>
          </div>

          <button
            @click="$emit('set-page', pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages || paginating"
            class="px-4 py-2 border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest text-stone-900 hover:bg-stone-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BookCard from "~/components/ui/book/BookCard.vue"

interface Props {
  books: any[]
  loading: boolean
  paginating: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  expanded: boolean
}

defineProps<Props>()
defineEmits<{
  'toggle-expanded': []
  'navigate-book': [id: string]
  'set-page': [page: number]
}>()
</script>
