<template>
  <div class="space-y-12 lg:space-y-20">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-[1.5px] border-stone-900 pb-10">
      <div class="space-y-2">
        <h1 class="font-serif text-5xl lg:text-7xl text-stone-900 italic tracking-tighter leading-none">
          The Collection
        </h1>
        <p class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">
          Main Registry / {{ pagination.total }} Volumes Indexed
        </p>
      </div>

      <NuxtLink v-if="isAuthenticated" to="/books/new">
        <button class="group flex items-center gap-3 bg-stone-900 text-stone-50 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-800 transition-all active:scale-95">
          <UIcon name="i-heroicons-plus" class="w-4 h-4 transition-transform group-hover:rotate-90" />
          Register New Volume
        </button>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <aside class="lg:col-span-3 sticky top-28">
        <FilterPanel
          :filters="filters"
          :genres="genres"
          @update:filters="handleFilterChange"
          @clear="resetAll"
        />
      </aside>

      <div class="lg:col-span-9 space-y-12">
        <SearchInput
          v-model="filters.search"
          placeholder="Search title or contributor..."
        />

        <div v-if="loading" class="py-32 text-center">
          <div class="flex flex-col items-center gap-4">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-stone-400 animate-spin" />
            <p class="text-[10px] font-black uppercase tracking-widest text-stone-400">LOADING COLLECTION...</p>
          </div>
        </div>

        <div v-else-if="!loading && books.length === 0" class="py-32 text-center border-[1.5px] border-stone-900 bg-stone-50/50">
          <h3 class="font-serif text-2xl italic">No Matching Records</h3>
          <button @click="resetAll" class="mt-4 text-[9px] font-black uppercase underline">Reset All Filters</button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          <BookCard
            v-for="book in books"
            :key="book.id"
            :book="book"
            @click="navigateToBook(book.id)"
          />
        </div>

        <div v-if="pagination.totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-stone-900 bg-white mt-auto text-black">
          <button
            @click.stop="setPage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="text-[10px] font-black uppercase tracking-widest hover:text-stone-500 disabled:opacity-20 transition-opacity"
          >
            Previous
          </button>

          <div class="flex flex-col items-center">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] text-stone-300 mb-1">Volume Registry</p>
            <p class="text-[10px] font-mono text-stone-500">
              VOL_{{ pagination.page.toString().padStart(2, '0') }} / {{ pagination.totalPages.toString().padStart(2, '0') }}
            </p>
          </div>

          <button
            @click.stop="setPage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="text-[10px] font-black uppercase tracking-widest hover:text-stone-500 disabled:opacity-20 transition-opacity"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
// import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import FilterPanel from '~/components/ui/layout/FilterPanel.vue'
import SearchInput from '~/components/ui/layout/SearchInput.vue'
import BookCard from '~/components/ui/book/BookCard.vue'

definePageMeta({
  title: 'The Collection',
  description: 'Browse and manage your library archive',
})

const {
  books,
  genres,
  filters,
  pagination,
  loading,
  fetchBooks,
  fetchGenres,
  setPage,
  resetFilters,
  resetAll,
} = useBooks()

const { isAuthenticated } = storeToRefs(useAuthStore())

const handleFilterChange = (newFilters?: Partial<typeof filters>) => {
  if (newFilters) Object.assign(filters, newFilters)
  pagination.page = 1
  fetchBooks()
}

const debouncedSearch = useDebounceFn(() => {
  pagination.page = 1
  fetchBooks()
}, 300)

watch(() => filters.search, debouncedSearch)

onMounted(async () => {
  try {
    await Promise.allSettled([
      fetchGenres(),
      fetchBooks()
    ])
  } catch (error) {
    console.error('Failed to load books page data:', error)
  }
})

const navigateToBook = (id: string) =>
  navigateTo(`/books/${id}`)
</script>
