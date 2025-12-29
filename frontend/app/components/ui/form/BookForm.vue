<template>
  <div
    class="max-w-xl mx-auto bg-stone-100 border border-stone-900 rounded-none shadow-[20px_20px_0px_0px_rgba(28,25,23,0.05)]"
  >
    <div class="border-b border-stone-900 p-8">
      <h2 class="font-serif text-2xl text-stone-900 uppercase tracking-tighter">
        {{ isEdit ? 'Modify Entry' : 'Add to Collection' }}
      </h2>
      <div class="h-1 w-12 bg-stone-900 mt-2"></div>
    </div>

    <form @submit.prevent="onSubmit" class="p-8 space-y-10 text-black">
      <div class="space-y-8">
        <div class="relative">
          <label
            class="absolute -top-3 left-3 bg-stone-100 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400"
          >
            Title
          </label>

          <input
            v-model="form.title"
            placeholder="BOOK TITLE"
            class="w-full bg-transparent border p-4 text-sm font-medium
                   border-stone-900/30 focus:outline-none focus:border-stone-900"
          />

          <p
            v-if="errors.title"
            class="mt-1 text-[10px] font-bold uppercase tracking-widest text-red-600"
          >
            {{ errors.title }}
          </p>
        </div>

        <div class="relative">
          <label
            class="absolute -top-3 left-3 bg-stone-100 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400"
          >
            Author
          </label>

          <input
            v-model="form.author"
            placeholder="AUTHOR NAME"
            class="w-full bg-transparent border p-4 text-sm font-medium
                   border-stone-900/30 focus:outline-none focus:border-stone-900"
          />

          <p
            v-if="errors.author"
            class="mt-1 text-[10px] font-bold uppercase tracking-widest text-red-600"
          >
            {{ errors.author }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="relative">
            <label
              class="absolute -top-3 left-3 bg-stone-100 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400"
            >
              Genre
            </label>

            <input
              v-model="form.genre"
              placeholder="GENRE"
              class="w-full bg-transparent border p-4 text-sm font-medium
                     border-stone-900/30 focus:outline-none focus:border-stone-900"
            />

            <p
              v-if="errors.genre"
              class="mt-1 text-[10px] font-bold uppercase tracking-widest text-red-600"
            >
              {{ errors.genre }}
            </p>
          </div>

          <div class="relative">
            <label
              class="absolute -top-3 left-3 bg-stone-100 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400"
            >
              Date
            </label>

            <input
              v-model="form.publication_date"
              type="date"
              class="w-full bg-transparent border p-4 text-sm font-medium
                     border-stone-900/30 focus:outline-none focus:border-stone-900"
            />

            <p
              v-if="errors.publication_date"
              class="mt-1 text-[10px] font-bold uppercase tracking-widest text-red-600"
            >
              {{ errors.publication_date }}
            </p>
          </div>
        </div>

        <div class="relative pt-6">
          <label
            class="absolute top-0 left-3 bg-stone-100 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400"
          >
            Cover Photo
          </label>
          
          <FileUpload
            v-model="form.cover_photo"
            :label="form.cover_photo ? 'Change Photo' : 'Upload Photo'"
            accept="image/*"
            class="border border-stone-900/30 p-4"
          />
          
          <p
            v-if="errors.cover_photo"
            class="mt-1 text-[10px] font-bold uppercase tracking-widest text-red-600"
          >
            {{ errors.cover_photo }}
          </p>
        </div>

        <div class="flex items-center justify-between py-4 border-t border-stone-200">
          <div>
            <div class="text-[10px] font-black uppercase tracking-[0.25em] text-stone-900 mb-1">
              Allow Comments
            </div>
            <p class="text-[9px] text-stone-500 uppercase tracking-wider">
              {{ form.allow_comments ? 'ENABLED' : 'DISABLED' }}
            </p>
          </div>
          <button
            type="button"
            @click="form.allow_comments = !form.allow_comments"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
            :class="form.allow_comments ? 'bg-stone-900' : 'bg-stone-200'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="form.allow_comments ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-4 pt-4">
        <button
          type="submit"
          :disabled="!isValid || loading"
          class="w-full bg-stone-900 text-stone-50 py-5
                 font-black uppercase tracking-[0.4em] text-[10px]
                 hover:invert transition-all
                 active:scale-[0.98]
                 disabled:bg-stone-300"
        >
          {{ loading ? 'Processing…' : 'Register Book' }}
        </button>

        <button
          type="button"
          @click="$emit('cancel')"
          class="w-full py-2 text-[9px] font-bold uppercase tracking-widest
                 text-stone-400 hover:text-stone-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Book, CreateBookInput, UpdateBookInput } from '~/schemas'
import { BookFormSchema } from '~/utils/schemas'
import FileUpload from './FileUpload.vue'

interface Props {
  book?: Book
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', data: CreateBookInput | UpdateBookInput): void
  (e: 'cancel'): void
}>()

const isEdit = computed(() => !!props.book)

const form = reactive<BookFormValues>({
  title: '',
  author: '',
  genre: '',
  publication_date: '',
  cover_photo: '',
  allow_comments: true
})

const { errors, validate } = useForm(BookFormSchema)

watch(
  () => props.book,
  (book: Book | undefined) => {
    if (!book) return

    form.title = book.title
    form.author = book.author
    form.genre = book.genre
    form.publication_date = book.publication_date
      ? book.publication_date.substring(0, 10)
      : ''
    form.cover_photo = book.cover_photo ?? ''
    form.allow_comments = book.allow_comments ?? true
  },
  { immediate: true }
)

const isValid = computed(() => {
  return validate(form)
})

const onSubmit = () => {
  if (!validate(form)) return

  const payload: UpdateBookInput = {
    title: form.title,
    author: form.author,
    genre: form.genre,
    publication_date: new Date(
      form.publication_date
    ).toISOString(),
    ...(form.cover_photo && { cover_photo: form.cover_photo }),
    allow_comments: form.allow_comments
  }

  emit('submit', payload)
}
</script>
