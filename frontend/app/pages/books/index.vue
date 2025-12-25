<template>
  <div class="space-y-12 lg:space-y-20">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-[1.5px] border-stone-900 pb-10">
      <div class="space-y-2">
        <h1 class="font-serif text-5xl lg:text-7xl text-stone-900 italic tracking-tighter leading-none">
          The Collection
        </h1>
        <p class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">
          Main Registry / 0 Volumes Indexed
        </p>
      </div>
      
      <NuxtLink to="/books/new">
        <button class="group flex items-center gap-3 bg-stone-900 text-stone-50 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-800 transition-all active:scale-95">
          <UIcon name="i-heroicons-plus" class="w-4 h-4 transition-transform group-hover:rotate-90" />
          Register New Volume
        </button>
      </NuxtLink>
    </div>
    
    <div class="text-center py-24 border-[1.5px] border-stone-900 bg-stone-50/50">
      <UIcon name="i-heroicons-book-open" class="w-16 h-16 text-stone-300 mx-auto mb-6" />
      <h3 class="font-serif text-2xl italic text-stone-900 mb-4">Backend Not Connected</h3>
      <p class="text-sm text-stone-600 mb-8">Book collection requires backend connection to display volumes</p>
      <NuxtLink to="/books/new">
        <button class="px-8 py-3 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.3em]">
          Register New Volume
        </button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
definePageMeta({
  title: 'Books',
  description: 'Browse and manage your library collection'
})
</script>
