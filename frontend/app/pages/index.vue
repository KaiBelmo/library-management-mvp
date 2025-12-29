<template>
  <div class="space-y-24 pb-20">
    <section class="relative py-20 border-b-[1.5px] border-stone-900 overflow-hidden">
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-3 mb-8">
          <div class="h-px w-12 bg-stone-900"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-900">
            Est. 2025 / Digital Ledger
          </span>
        </div>

        <h1 class="font-serif text-6xl lg:text-9xl text-stone-900 italic tracking-tighter leading-[0.85] mb-8">
          The Atheneum <br />
          Library Archive
        </h1>

        <p class="text-lg md:text-xl text-stone-600 mb-12 max-w-2xl font-medium leading-relaxed">
          A high-fidelity registry for the modern collector. Curate your
          volumes, document your insights, and maintain the integrity of your
          literary collection.
        </p>

        <div class="flex flex-wrap gap-6">
          <NuxtLink to="/books"
            class="bg-stone-900 text-stone-50 px-10 py-4 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-stone-800 transition-all inline-flex items-center gap-3">
            Enter the Archive
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>

          <NuxtLink to="/books/new"
            class="bg-transparent border-[1.5px] border-stone-900 text-stone-900 px-10 py-4 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-stone-50 transition-all">
            Register New Volume
          </NuxtLink>
        </div>
      </div>
    </section>

    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-900 border-[1.5px] border-stone-900">
        <template v-if="loading">
          <StatSkeleton v-for="i in 2" :key="i" />
        </template>
        <template v-else>
          <ClientOnly>
            <StatCard label="Total Holdings" :value="stats.totalBooks" subtitle="Verified Volumes" />
            <StatCard label="Taxonomy" :value="stats.totalGenres" subtitle="Genre Classifications" />
            <template #fallback>
              <StatSkeleton v-for="i in 2" :key="i" />
            </template>
          </ClientOnly>
        </template>
      </div>
    </section>

    <section>
      <div
        class="flex flex-col items-center text-center md:text-left md:flex-row md:justify-between md:items-end mb-12 gap-6 border-b border-stone-100 pb-8">
        <div class="w-full md:w-auto">
          <h2 class="font-serif text-3xl sm:text-4xl text-stone-900 italic tracking-tight">
            Recent Acquisitions
          </h2>
          <p class="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mt-2">
            The latest additions to the library registry
          </p>
        </div>

        <NuxtLink to="/books"
          class="text-[10px] font-black uppercase tracking-widest text-stone-900 underline underline-offset-8 hover:text-stone-500 transition-colors">
          View Full Catalogue
        </NuxtLink>
      </div>

      <div v-if="loading">
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <BookCardSkeleton v-for="i in 2" :key="i" class="sm:hidden" />
          <BookCardSkeleton v-for="i in 3" :key="i" class="hidden sm:block" />
        </div>
      </div>

      <div v-else-if="!loading && (recentBooks.length === 0)">
        <div class="py-20 text-center border-[1.5px] border-dashed border-stone-300">
          <div class="space-y-4">
            <UIcon name="i-heroicons-book-open" class="w-12 h-12 text-stone-400 mx-auto" />
            <h3 class="font-serif text-2xl italic text-stone-600">No Volumes in Archive</h3>
            <p class="text-[10px] font-black uppercase tracking-widest text-stone-400">
              Be the first to register a volume
            </p>
            <NuxtLink
              class="mt-4 px-6 py-3 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all"
              to="/books/new">
              Register First Volume
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <BookCard 
            v-for="book in recentBooks" 
            :key="book.id" 
            :book="book" 
            @click="navigateToBook(book.id)" 
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/schemas'
import BookCard from '~/components/ui/book/BookCard.vue'
import BookCardSkeleton from '~/components/ui/book/BookCardSkeleton.vue'
import StatCard from '~/components/ui/feedback/StatCard.vue'
import StatSkeleton from '~/components/ui/feedback/StatSkeleton.vue'

definePageMeta({
  title: 'Archive Home',
})

const {
  books,
  genres,
  filters,
  pagination,
  loading,
  fetchBooks,
  fetchGenres,
} = useBooks()

// Set filters first, then fetch data
filters.sortBy = 'date_created'
filters.sortOrder = 'desc'

// Set pagination and fetch data
pagination.page = 1
pagination.limit = 4

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

const recentBooks = computed<Book[]>(() =>
  getPageItems(books.value, 1, 4)
)

const stats = computed(() => ({
  totalBooks: pagination.total,
  totalGenres: genres.value.length,
}))

const navigateToBook = (id: string) => {
  navigateTo(`/books/${id}`)
}
</script>