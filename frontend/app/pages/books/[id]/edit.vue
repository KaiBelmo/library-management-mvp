<template>
  <div class="max-w-xl mx-auto text-center py-20 border-[1.5px] border-stone-900 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.03)]">
    <UIcon name="i-heroicons-pencil-square" class="w-12 h-12 text-stone-900 mx-auto mb-6" />
    <h3 class="font-serif text-2xl uppercase tracking-tighter italic text-stone-900 mb-3">Backend Not Connected</h3>
    <p class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-8 px-10 leading-relaxed">
      Volume editing requires backend connection to modify registry records.
    </p>
    <div class="flex gap-4 justify-center">
      <button @click="goBack" class="px-8 py-3 border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all">
        Return to Volume
      </button>
      <button @click="goToBooks" class="px-8 py-3 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-stone-800 transition-all">
        Return to Archive
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

// Routing logic
const route = useRoute()
const bookId = route.params.id

const goBack = () => {
  navigateTo(`/books/${bookId}`)
}

const goToBooks = () => {
  navigateTo('/books')
}
</script>