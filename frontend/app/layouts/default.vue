<template>
  <div class="min-h-screen bg-white selection:bg-stone-900 selection:text-white">
    <NavBar />

    <main class="max-w-350 mx-auto px-6 md:px-10 py-12 lg:py-20">
      <div class="flex items-center gap-4 mb-12 opacity-20">
        <div class="h-1 flex-1 bg-stone-900"></div>
        <div class="h-2 w-2 rounded-full bg-stone-900"></div>
        <div class="h-1 w-12 bg-stone-900"></div>
      </div>

      <slot />
    </main>

    <footer class="mt-auto border-t border-stone-100 py-10 px-10">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
          Librarus Library Archive © 2025
        </p>
        <div class="flex gap-8">
          <span class="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Protocol v1.0.4</span>
          <span class="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Privacy Ledger</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import NavBar from '~/components/layout/NavBar.vue'
</script>

<style>
/* Smooth transitions for the entire app */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Custom Scrollbar for the Gallery Look */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #1c1917; /* stone-900 */
}
</style>