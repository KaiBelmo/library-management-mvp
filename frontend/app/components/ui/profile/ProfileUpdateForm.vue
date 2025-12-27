<template>
  <section class="space-y-6 text-black">
    <div
      class="flex items-center justify-between border-b border-stone-200 pb-4 cursor-pointer hover:bg-stone-50 -mx-4 px-4 py-2 transition-all"
      @click="$emit('toggle-expanded')"
    >
      <h2 class="text-[10px] font-black uppercase tracking-widest text-stone-900">
        Identification Parameters
      </h2>
      <UIcon 
        :name="expanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" 
        class="w-4 h-4 text-black transition-transform"
      />
    </div>

    <div v-if="expanded" class="p-10 border-[1.5px] border-stone-900 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.03)]">
      <form @submit.prevent="$emit('update')" class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Given Name
          </label>
          <input
            v-model="form.first_name"
            type="text"
            class="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-stone-900"
          />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Surname
          </label>
          <input
            v-model="form.last_name"
            type="text"
            class="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-stone-900"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Email Address
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-stone-900"
          />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-stone-400">
            New Password
          </label>
          <input
            v-model="form.password"
            type="password"
            placeholder="RETAIN CURRENT"
            class="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-stone-900 placeholder:text-[9px]"
          />
        </div>
      </div>

      <div class="flex justify-between items-center pt-6">
        <p
          v-if="statusMsg"
          :class="isError ? 'text-rose-600' : 'text-emerald-600'"
          class="text-[10px] font-bold uppercase tracking-widest"
        >
          {{ statusMsg }}
        </p>

        <button
          type="submit"
          :disabled="pending"
          class="px-10 py-4 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.4em] disabled:bg-stone-300"
        >
          {{ pending ? "Synchronizing..." : "Commit Changes" }}
        </button>
      </div>
    </form>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  form: {
    first_name: string
    last_name: string
    email: string
    password: string
  }
  pending: boolean
  statusMsg: string
  isError: boolean
  expanded: boolean
}

defineProps<Props>()
defineEmits<{
  update: []
  'toggle-expanded': []
}>()
</script>
