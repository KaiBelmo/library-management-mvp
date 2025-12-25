<template>
  <div class="space-y-12">
    <div v-if="loading && comments.length === 0" class="space-y-8">
      <div v-for="i in 3" :key="i" class="animate-pulse flex gap-6">
        <div class="w-[2px] bg-stone-200"></div>
        <div class="flex-1 pb-8 space-y-4">
          <div class="h-3 bg-stone-200 w-1/4"></div>
          <div class="h-12 bg-stone-100 w-full"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="comments.length === 0" class="py-16 text-center border-2 border-dashed border-stone-200 rounded-none">
      <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="w-10 h-10 text-stone-300 mx-auto mb-4" />
      <p class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Archive Empty: No Annotations Found</p>
    </div>
    
    <div v-else class="space-y-0">
      <div 
        v-for="comment in comments" 
        :key="comment.id" 
        class="group flex gap-8 relative border-t border-stone-900 last:border-b py-10 transition-colors hover:bg-stone-50/50"
      >
        <div class="hidden md:flex flex-col items-end w-32 shrink-0">
          <span class="text-[10px] font-black uppercase tracking-widest text-stone-900 leading-none">
            Entry No.
          </span>
          <span class="text-[9px] font-serif italic text-stone-400 mt-1">
            {{ comment.id.slice(0, 5) }}
          </span>
        </div>

        <div class="flex-1 pr-4">
          <div class="flex justify-between items-baseline mb-6">
            <div>
              <h4 class="font-serif text-xl text-stone-900 italic tracking-tight mb-1">
                {{ comment.author_name }}
              </h4>
              <p class="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">
                Logged: {{ comment.date_created }}
              </p>
            </div>
          </div>

          <p class="text-stone-900 text-sm leading-relaxed font-medium whitespace-pre-wrap max-w-2xl">
            {{ comment.content }}
          </p>
        </div>
      </div>
    </div>
    
    <div v-if="totalPages > 1" class="flex justify-between items-center pt-10 border-t-2 border-stone-900">
      <span class="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <div class="flex gap-4">
        <button 
          :disabled="currentPage === 1"
          @click="$emit('page-change', currentPage - 1)"
          class="p-2 border border-stone-900 hover:bg-stone-900 hover:text-white disabled:opacity-20 transition-all"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        </button>
        <button 
          :disabled="currentPage === totalPages"
          @click="$emit('page-change', currentPage + 1)"
          class="p-2 border border-stone-900 hover:bg-stone-900 hover:text-white disabled:opacity-20 transition-all"
        >
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
defineProps({
  comments: Array,
  loading: Boolean,
  currentPage: Number,
  totalPages: Number,
  total: Number,
  limit: Number,
  currentUser: Object
})

defineEmits(['page-change'])
</script>