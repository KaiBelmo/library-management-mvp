<template>
  <div class="space-y-8 lg:space-y-20 px-4 md:px-0">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-[1.5px] border-stone-900 pb-8 md:pb-10">
      <div class="space-y-2">
        <h1 class="font-serif text-4xl md:text-5xl lg:text-7xl text-stone-900 italic tracking-tighter leading-none">
          The Collection
        </h1>
        <p class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
          Main Registry / {{ pagination.total }} Volumes Indexed
        </p>
      </div>

      <ClientOnly>
        <NuxtLink v-if="isAuthenticated" to="/books/new" class="w-full md:w-auto">
          <button class="w-full group flex items-center justify-center gap-3 bg-stone-900 text-stone-50 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all">
            <UIcon name="i-heroicons-plus" class="w-4 h-4 transition-transform group-hover:rotate-90" />
            Register New Volume
          </button>
        </NuxtLink>
      </ClientOnly>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
      <button 
        @click="isMobileFilterOpen = true"
        class="lg:hidden w-full py-4 border border-stone-900 text-black flex items-center justify-between px-6 text-[10px] font-black uppercase tracking-widest"
      >
        <span>Refine Search</span>
        <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
      </button>

      <aside class="hidden lg:block lg:col-span-3 sticky top-28">
        <FilterPanel
          :filters="filters"
          :genres="genres"
          @update:filters="handleFilterChange"
          @clear="resetAll"
        />
      </aside>

      <div class="lg:col-span-9 space-y-8 lg:space-y-12">
        <SearchInput
          v-model="filters.search"
          placeholder="Search title..."
        />

        <div v-if="loading" class="py-20 text-center">...</div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
          <BookCard 
            v-for="book in books" 
            :key="book.id" 
            :book="book" 
            @click="navigateToBook(book.id)" 
          />
        </div>

        <div v-if="pagination.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-6 border border-stone-900 bg-white">
          <button @click="setPage(pagination.page - 1)" :disabled="pagination.page === 1" class="text-[10px] font-black uppercase tracking-widest">Previous</button>
          
          <div class="text-center">
             <p class="text-[10px] font-mono text-stone-500">VOL_{{ pagination.page }} / {{ pagination.totalPages }}</p>
          </div>

          <button @click="setPage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages" class="text-[10px] font-black uppercase tracking-widest">Next</button>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isMobileFilterOpen" class="fixed inset-0 z-[60] lg:hidden">
        <div class="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" @click="isMobileFilterOpen = false"></div>
        <div class="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-stone-50 p-6 overflow-y-auto">
          <div class="flex justify-between items-center mb-8">
            <span class="font-serif italic text-xl">Filters</span>
            <button @click="isMobileFilterOpen = false" class="p-2 border border-stone-900">
               <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>
          <FilterPanel
            :filters="filters"
            :genres="genres"
            @update:filters="handleFilterChange"
            @clear="resetAll"
          />
        </div>
      </div>
    </Transition>
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
const isMobileFilterOpen = ref(false)

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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>