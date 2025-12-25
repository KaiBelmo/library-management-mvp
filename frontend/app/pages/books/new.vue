<template>
  <div class="max-w-2xl mx-auto pb-20">
    <div class="mb-12 border-b-[1.5px] border-stone-900 pb-8 flex justify-between items-end">
      <div class="space-y-2">
        <h1 class="font-serif text-4xl lg:text-5xl text-stone-900 italic tracking-tighter">
          Register Volume
        </h1>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
          New Archive Entry / Protocol 01
        </p>
      </div>
      
      <NuxtLink 
        to="/books"
        class="text-[9px] font-black uppercase tracking-widest text-stone-900 hover:text-stone-400 flex items-center gap-2 transition-colors mb-1"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-3 h-3" />
        Discard Entry
      </NuxtLink>
    </div>
    
    <div class="relative">
      <div class="absolute -left-10 top-0 bottom-0 w-[1px] bg-stone-100 hidden lg:block"></div>
      
      <div class="bg-white p-2">
        <div class="text-center py-24 border-[1.5px] border-stone-900 bg-stone-50/50">
          <UIcon name="i-heroicons-document-plus" class="w-16 h-16 text-stone-300 mx-auto mb-6" />
          <h3 class="font-serif text-2xl italic text-stone-900 mb-4">Backend Not Connected</h3>
          <p class="text-sm text-stone-600 mb-8">Volume registration requires backend connection</p>
          <NuxtLink to="/books">
            <button class="px-8 py-3 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.3em]">
              Return to Archive
            </button>
          </NuxtLink>
        </div>
      </div>
      
      <div class="mt-12 pt-8 border-t border-stone-100">
        <p class="text-[9px] text-stone-300 uppercase tracking-[0.2em] italic">
          * Ensure all metadata is accurate before finalizing the registry entry.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  title: 'Register New Volume',
  layout: 'default'
})
</script>