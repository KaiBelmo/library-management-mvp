<template>
  <div class="max-w-2xl mx-auto pb-20">
    <!-- Header -->
    <div
      class="mb-12 border-b-[1.5px] border-stone-900 pb-8 flex justify-between items-end"
    >
      <div class="space-y-2">
        <h1
          class="font-serif text-4xl lg:text-5xl text-stone-900 italic tracking-tighter"
        >
          Register Volume
        </h1>
        <p
          class="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400"
        >
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

    <!-- Form -->
    <form
      @submit.prevent="handleSubmit"
      class="space-y-10 border-[1.5px] border-stone-900 p-10 bg-white"
    >
      <div class="space-y-2">
        <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-black">Title</label>
        <input v-model="form.title" class="w-full bg-transparent border-b-[1.5px] border-stone-900 py-2 focus:outline-none text-sm font-medium text-black placeholder:text-black/40 uppercase tracking-tight" />
        <p v-if="errors.title" class="text-[9px] text-rose-600 uppercase tracking-[0.15em] mt-1">{{ errors.title }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-black">Author</label>
        <input v-model="form.author" class="w-full bg-transparent border-b-[1.5px] border-stone-900 py-2 focus:outline-none text-sm font-medium text-black placeholder:text-black/40 uppercase tracking-tight" />
        <p v-if="errors.author" class="text-[9px] text-rose-600 uppercase tracking-[0.15em] mt-1">{{ errors.author }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-black">Genre</label>
        <input v-model="form.genre" class="w-full bg-transparent border-b-[1.5px] border-stone-900 py-2 focus:outline-none text-sm font-medium text-black placeholder:text-black/40 uppercase tracking-tight" />
        <p v-if="errors.genre" class="text-[9px] text-rose-600 uppercase tracking-[0.15em] mt-1">{{ errors.genre }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-[10px] font-black uppercase tracking-[0.25em] text-black">Publication Date</label>
        <input
          v-model="form.publication_date"
          type="date"
          class="w-full bg-transparent border-b-[1.5px] border-stone-900 py-2 focus:outline-none text-sm font-medium text-black placeholder:text-black/40 uppercase tracking-tight"
        />
        <p v-if="errors.publication_date" class="text-[9px] text-rose-600 uppercase tracking-[0.15em] mt-1">{{ errors.publication_date }}</p>
      </div>

      <FileUpload
        v-model="form.cover_photo"
        label="Cover Photo"
        accept="image/*"
      />

      <p
        v-if="errorMessage"
        class="text-[10px] font-black uppercase tracking-widest text-rose-600"
      >
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        :disabled="pending"
        class="w-full py-4 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.4em] disabled:opacity-40"
      >
        {{ pending ? 'Registering…' : 'Register Volume' }}
      </button>
    </form>

    <!-- Footer note -->
    <div class="mt-12 pt-8 border-t border-stone-100">
      <p class="text-[9px] text-stone-300 uppercase tracking-[0.2em] italic">
        * Ensure all metadata is accurate before finalizing the registry entry.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateBookInput } from '~/schemas'
import { useBooks } from '~/composables/useBooks'
import { BookFormSchema } from '~/utils/schemas'
import { useForm } from '~/composables/useForm'
import FileUpload from '~/components/ui/form/FileUpload.vue'

definePageMeta({
  title: 'Register New Volume',
  middleware: 'auth'
})

const { create: createBook } = useBooks()
const { pending, errorMessage, errors, validate, runAction } = useForm(BookFormSchema)

const form = reactive<CreateBookInput>({
  title: '',
  author: '',
  genre: '',
  publication_date: '',
  cover_photo: ''
})

const handleSubmit = async () => {
  if (!validate(form)) return
  
  await runAction(async () => {
    await createBook(form)
    await navigateTo('/books')
  })
}
</script>

