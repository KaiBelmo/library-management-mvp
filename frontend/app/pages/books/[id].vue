<template>
  <div class="max-w-7xl mx-auto px-6 py-10 lg:py-20">
    <div class="text-center py-24 border-[1.5px] border-stone-900 bg-white">
      <UIcon name="i-heroicons-archive-box-x-mark" class="w-16 h-16 text-stone-200 mx-auto mb-6" />
      <h3 class="font-serif text-3xl italic text-stone-900 mb-4">Backend Not Connected</h3>
      <p class="text-sm text-stone-600 mb-8">Book details require backend connection to display volume information</p>
      <div class="flex gap-4 justify-center">
        <button @click="goBack" class="px-8 py-3 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.4em]">
          Return to Archive
        </button>
        <button @click="editBook" class="px-8 py-3 border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all">
          Modify Record
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Book Details',
  description: 'View book details and comments'
})

// Route
const route = useRoute()
const bookId = route.params.id

// Navigation methods
const editBook = () => {
  navigateTo(`/books/${bookId}/edit`)
}

const goBack = () => {
  navigateTo('/books')
}
</script>
