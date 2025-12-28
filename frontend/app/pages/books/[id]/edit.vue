<template>
  <div v-if="fetchLoading" class="max-w-2xl mx-auto space-y-12 animate-pulse pt-10">
    <div class="space-y-4">
      <div class="h-10 bg-stone-200 w-1/2"></div>
      <div class="h-[1.5px] bg-stone-900 w-full"></div>
    </div>
    <div class="h-150 border border-stone-200 bg-stone-50"></div>
  </div>
  
  <div v-else-if="!fetchLoading && !book" class="max-w-xl mx-auto text-center py-20 border-[1.5px] border-stone-900 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.03)]">
    <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-stone-900 mx-auto mb-6" />
    <h3 class="font-serif text-2xl uppercase tracking-tighter italic text-stone-900 mb-3">Record Missing</h3>
    <NuxtLink to="/books">
      <button class="px-8 py-3 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.4em]">
        Return to Archive
      </button>
    </NuxtLink>
  </div>
  
  <div v-else class="max-w-2xl mx-auto pb-20">
    <div class="mb-12 border-b-[1.5px] border-stone-900 pb-8 flex justify-between items-end">
      <div class="space-y-2">
        <h1 class="font-serif text-4xl text-stone-900 italic tracking-tight">Editing Record</h1>
        <p v-if="book" class="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
          Ref: {{ bookId.slice(0, 8).toUpperCase() }} — {{ book.title.toUpperCase() }}
        </p>
      </div>
      
      <NuxtLink 
        :to="`/books/${bookId}`"
        class="text-[9px] font-black uppercase tracking-widest text-stone-900 hover:text-stone-400 flex items-center gap-2 transition-colors mb-1"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-3 h-3" />
        Return to Volume
      </NuxtLink>
    </div>
    
    <div class="relative">
      <div class="absolute -left-10 top-0 bottom-0 w-px bg-stone-100 hidden lg:block"></div>
      
      <BookForm
        v-if="book"
        :book="book"
        :loading="updateLoading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpdateBookInput, Book } from '~/schemas'
import BookForm from '~/components/ui/form/BookForm.vue'
import { useBooks } from '~/composables/useBooks'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'is-owner']
})

const route = useRoute()
const bookId = route.params.id as string

const { getById, update, loading: fetchLoading } = useBooks()

const book = ref<Book | null>(null)
const updateLoading = ref(false)

onMounted(async () => {
  try {
    const data = await getById(bookId)
    if (data) {
      book.value = data
    } else {
      await navigateTo('/books')
    }
  } catch (error) {
    console.error('Failed to load book:', error)
  }
})

const handleSubmit = async (data: UpdateBookInput) => {
  updateLoading.value = true
  try {
    await update(bookId, data)
    await navigateTo(`/books/${bookId}`)
  } catch (error) {
    console.error('Failed to update book:', error)
  } finally {
    updateLoading.value = false
  }
}


const handleCancel = () => {
  navigateTo(`/books/${bookId}`)
}
</script>