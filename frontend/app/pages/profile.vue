<template>
  <div class="max-w-4xl mx-auto px-6 py-10 lg:py-20 selection:bg-stone-900 selection:text-white">
    <div class="space-y-16">
      <header class="border-b-[1.5px] border-stone-900 pb-12">
        <div class="flex flex-col md:flex-row justify-between items-end gap-8">
          <div class="space-y-4">
            <p class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">Registry Personnel</p>
            <h1 class="font-serif text-5xl md:text-6xl text-stone-900 italic tracking-tighter leading-none">
              Account Dossier
            </h1>
            <p class="text-sm font-medium text-stone-500 uppercase tracking-tight">Access Level: Librarian</p>
          </div>
          
          <div class="flex gap-4">
            <button
              onclick="window.location.href='/login'"
              class="group flex items-center gap-2 px-6 py-3 border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest text-stone-900 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
            >
              Terminate Session
              <UIcon name="i-heroicons-power" class="w-3 h-3 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>
      </header>

      <div class="text-center py-24 border-[1.5px] border-stone-900 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.03)]">
        <UIcon name="i-heroicons-finger-print" class="w-16 h-16 text-stone-200 mx-auto mb-6" />
        <h3 class="font-serif text-3xl italic text-stone-900 mb-4">Backend Not Connected</h3>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-8 px-10 leading-relaxed">
          Profile functionality requires backend connection. Connect to a backend to access personnel records.
        </p>
        <button onclick="window.location.href='/login'" class="px-8 py-3 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.4em]">
          Re-authenticate
        </button>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  title: 'Personnel Dossier'
})
</script>