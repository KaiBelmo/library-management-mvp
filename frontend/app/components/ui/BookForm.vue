<template>
  <div
    class="max-w-xl mx-auto bg-stone-100 border border-stone-900 rounded-none shadow-[20px_20px_0px_0px_rgba(28,25,23,0.05)]"
  >
    <div class="border-b border-stone-900 p-8">
      <h2 class="font-serif text-2xl text-stone-900 uppercase tracking-tighter">
        Backend Not Connected
      </h2>
      <div class="h-1 w-12 bg-stone-900 mt-2"></div>
    </div>

    <div class="p-8 text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-stone-400 mx-auto mb-4" />
      <p class="text-sm text-stone-600 mb-6">Form functionality requires backend connection</p>
      <button
        @click="$emit('cancel')"
        class="w-full py-2 text-[9px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
              class="absolute -top-3 left-3 bg-stone-100 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400"
              >Genre</label
            >
            <input
              v-model="form.genre"
              placeholder="GENRE"
              class="w-full bg-transparent border text-black border-stone-900/30 p-4 focus:outline-none focus:border-stone-900 transition-colors text-sm font-medium"
            />
          </div>
          <div class="relative">
            <label
              class="absolute -top-3 left-3 bg-stone-100 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400"
              >Date</label
            >
            <input
              v-model="form.publication_date"
              type="date"
              class="w-full bg-transparent border text-black border-stone-900/30 p-4 focus:outline-none focus:border-stone-900 transition-colors text-sm font-medium"
            />
          </div>
        </div>

        <div class="relative">
          <label
            class="absolute -top-3 left-3 bg-stone-100 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400"
            >Image Source</label
          >
          <input
            v-model="form.image"
            placeholder="URL"
            class="w-full bg-transparent border text-black border-stone-900/30 p-4 focus:outline-none focus:border-stone-900 transition-colors text-sm font-medium"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4 pt-4">
        <button
          type="submit"
          :disabled="!isValid || loading"
          class="w-full bg-stone-900 text-stone-50 py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:invert hover:text-white transition-all active:scale-[0.98] disabled:bg-stone-300"
        >
          {{ loading ? "Processing..." : "Register Book" }}
        </button>

        <button
          type="button"
          @click="$emit('cancel')"
          class="w-full py-2 text-[9px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
defineProps({
  loading: Boolean
})

defineEmits(['cancel'])
</script>
