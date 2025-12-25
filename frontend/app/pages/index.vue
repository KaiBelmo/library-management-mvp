<template>
  <div class="space-y-24 pb-20">
    <section class="relative py-20 border-b-[1.5px] border-stone-900 overflow-hidden">
      <div class="absolute -right-20 -bottom-10 text-[20rem] font-serif italic text-stone-50 select-none -z-10 leading-none">
        Index
      </div>

      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-3 mb-8">
          <div class="h-1 w-12 bg-stone-900"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-900">Est. 2025 / Digital Ledger</span>
        </div>
        
        <h1 class="font-serif text-6xl lg:text-9xl text-stone-900 italic tracking-tighter leading-[0.85] mb-8">
          Librarus <br /> Library Archive
        </h1>
        
        <p class="text-lg md:text-xl text-stone-600 mb-12 max-w-2xl font-medium leading-relaxed">
          A high-fidelity registry for the modern collector. Curate your volumes, document your insights, and maintain the integrity of your literary collection.
        </p>
        
        <div class="flex flex-wrap gap-6">
          <NuxtLink to="/books">
            <button class="bg-stone-900 text-stone-50 px-10 py-4 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-stone-800 transition-all flex items-center gap-3">
              Enter the Archive
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </button>
          </NuxtLink>
          <NuxtLink to="/books/new">
            <button class="bg-transparent border-[1.5px] border-stone-900 text-stone-900 px-10 py-4 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-stone-50 transition-all">
              Register New Volume
            </button>
          </NuxtLink>
        </div>
      </div>
    </section>
    
    <section>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-900 border-[1.5px] border-stone-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.03)]">
        <div class="bg-white p-10 space-y-4">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Total Holdings</p>
          <div class="text-6xl font-serif italic text-stone-900">0</div>
          <p class="text-xs font-bold text-stone-900 uppercase tracking-widest">Verified Volumes</p>
        </div>
        
        <div class="bg-white p-10 space-y-4 border-t md:border-t-0 md:border-l border-stone-900">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Taxonomy</p>
          <div class="text-6xl font-serif italic text-stone-900">0</div>
          <p class="text-xs font-bold text-stone-900 uppercase tracking-widest">Genre Classifications</p>
        </div>
        
        <div class="bg-white p-10 space-y-4 border-t md:border-t-0 md:border-l border-stone-900">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Activity Ledger</p>
          <div class="text-6xl font-serif italic text-stone-900">0</div>
          <p class="text-xs font-bold text-stone-900 uppercase tracking-widest">Reader Annotations</p>
        </div>
      </div>
    </section>
    
    <section>
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-stone-100 pb-8">
        <div>
          <h2 class="font-serif text-4xl text-stone-900 italic tracking-tight">Recent Acquisitions</h2>
          <p class="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mt-2">The latest additions to the library registry</p>
        </div>
        <NuxtLink to="/books" class="text-[10px] font-black uppercase tracking-widest text-stone-900 underline underline-offset-8 hover:text-stone-500 transition-colors">
          View Full Catalogue
        </NuxtLink>
      </div>
      
      <div class="text-center py-24 border-[1.5px] border-stone-900 bg-stone-50/50">
        <UIcon name="i-heroicons-document-plus" class="w-12 h-12 text-stone-300 mx-auto mb-6" />
        <h3 class="font-serif text-2xl italic text-stone-900 mb-4">The Archive is Empty</h3>
        <p class="text-sm text-stone-600 mb-8">Connect to a backend to populate your library collection</p>
        <NuxtLink to="/books/new">
          <button class="px-8 py-3 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.3em]">
            Begin Registration
          </button>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script>
definePageMeta({
  title: 'Archive Home'
})
</script>