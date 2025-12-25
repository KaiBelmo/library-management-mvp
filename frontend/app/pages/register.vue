<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-6 selection:bg-stone-900 selection:text-white">
    <div class="w-full max-w-md animate-fade-in">
      <div class="text-center mb-12">
        <div class="inline-flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-stone-900 bg-white text-stone-900 mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <UIcon name="i-heroicons-user-plus" class="h-6 w-6" />
        </div>
        <h1 class="font-serif text-4xl text-stone-900 italic tracking-tighter mb-2 leading-none">
          Request Access
        </h1>
        <p class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">
          Librarian Registration / Protocol 02
        </p>
      </div>

      <div class="border-[1.5px] border-stone-900 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)] mb-14 relative">
        <div class="absolute top-0 left-0 w-full h-0.75 bg-stone-900"></div>
        
        <div class="p-8 md:p-10 space-y-8">
          <div class="p-4 border-[1.5px] border-amber-600 bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
            Backend not connected - Registration functionality disabled
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3">
                Full Name
              </label>
              <UInput
                type="text"
                placeholder="Ex: Julian Barnes"
                size="lg"
                variant="none"
                disabled
                class="w-full border-b-[1.5px] text-black border-stone-200 focus:border-stone-900 transition-colors rounded-none px-0 py-2 opacity-50"
                :ui="{ base: '!text-black placeholder:!text-stone-400' }"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3">
                Registry Email
              </label>
              <UInput
                type="email"
                placeholder="librarian@atheneum.library"
                size="lg"
                variant="none"
                disabled
                class="w-full border-b-[1.5px] text-black border-stone-200 focus:border-stone-900 transition-colors rounded-none px-0 py-2 opacity-50"
                :ui="{ base: '!text-black placeholder:!text-stone-400' }"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3">
                Access Code
              </label>
              <UInput
                type="password"
                placeholder="Minimum 6 characters"
                size="lg"
                variant="none"
                disabled
                class="w-full border-b-[1.5px] text-black border-stone-200 focus:border-stone-900 transition-colors rounded-none px-0 py-2 opacity-50"
                :ui="{ base: '!text-black placeholder:!text-stone-400' }"
              />
            </div>
          </div>

          <div class="pt-4">
            <button
              disabled
              class="w-full bg-stone-900 text-stone-50 py-4 text-[10px] font-black uppercase tracking-[0.4em] disabled:bg-stone-300 disabled:text-stone-500 transition-all flex items-center justify-center gap-3"
            >
              Submit Request
              <UIcon name="i-heroicons-paper-airplane" class="w-3 h-3" />
            </button>
          </div>

          <div class="text-center pt-2">
            <NuxtLink to="/login" class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 underline underline-offset-8 transition-colors">
              Existing Curator? Sign In
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: false,
  title: 'Request Access'
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>