<template>
  <div class="max-w-7xl mx-auto px-6 py-10 lg:py-20">
    <div v-if="bookLoading" class="space-y-12">
      <div class="animate-pulse space-y-4">
        <div class="h-4 bg-stone-100 w-32"></div>
        <div class="h-16 bg-stone-100 w-3/4"></div>
        <div class="h-6 bg-stone-50 w-48"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div
          class="lg:col-span-5 h-[600px] bg-stone-100 border border-stone-200 animate-pulse"
        ></div>
        <div class="lg:col-span-7 space-y-10">
          <div class="space-y-4">
            <div class="h-4 bg-stone-50 w-full"></div>
            <div class="h-4 bg-stone-50 w-full"></div>
            <div class="h-4 bg-stone-50 w-2/3"></div>
          </div>
          <div
            class="h-64 bg-stone-50 border border-stone-100 animate-pulse"
          ></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!bookLoading && !book"
      class="text-center py-24 border-[1.5px] border-stone-900 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.03)]"
    >
      <UIcon
        name="i-heroicons-archive-box-x-mark"
        class="w-16 h-16 text-stone-200 mx-auto mb-6"
      />
      <h3 class="font-serif text-3xl italic text-stone-900 mb-4">
        Volume Not Found
      </h3>
      <NuxtLink to="/books">
        <button
          class="px-8 py-3 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.4em]"
        >
          Return to Archive
        </button>
      </NuxtLink>
    </div>
    <div v-else-if="book" class="space-y-10 lg:space-y-16 px-4 md:px-0">
      <header
        class="border-b-[1.5px] border-stone-900 pb-8 md:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8"
      >
        <div class="space-y-3 md:space-y-4 w-full">
          <p
            class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-stone-400"
          >
            Catalogue Entry No. {{ book.id.slice(0, 6).toUpperCase() }}
          </p>
          <h1
            class="font-serif text-4xl sm:text-5xl lg:text-7xl text-stone-900 italic tracking-tighter leading-[1.1] md:leading-none"
          >
            {{ book.title }}
          </h1>
          <p
            class="text-lg md:text-xl font-medium text-stone-600 uppercase tracking-widest"
          >
            — {{ book.author }}
          </p>
        </div>

        <div
          v-if="
            (isAuthenticated && book.user_created === auth.user?.id) ||
            isAdminUser
          "
          class="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
        >
          <NuxtLink :to="`/books/${book.id}/edit`" class="w-full sm:w-auto">
            <button
              class="w-full px-6 py-4 md:py-3 text-black border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all active:scale-95"
            >
              Modify Record
            </button>
          </NuxtLink>
          <button
            @click="confirmDelete"
            class="w-full sm:w-auto px-6 py-4 md:py-3 border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-600 hover:text-white transition-all active:scale-95"
          >
            Purge Entry
          </button>
        </div>
      </header>

      <div
        class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
      >
        <div class="lg:col-span-5 space-y-6 md:space-y-8">
          <div
            class="aspect-[3/4] bg-stone-50 border-[1.5px] border-stone-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.03)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)]"
          >
            <img
              v-if="book.image"
              :src="book.image"
              :alt="book.title"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-stone-300"
            >
              <UIcon
                name="i-heroicons-book-open"
                class="w-16 h-16 md:w-24 md:h-24 mb-4"
              />
              <span class="text-[10px] font-black uppercase tracking-widest"
                >No Cover Image</span
              >
            </div>
          </div>

          <div
            class="grid grid-cols-2 gap-px bg-stone-900 border-[1.5px] border-stone-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.03)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)]"
          >
            <div class="bg-white p-4 md:p-6">
              <span
                class="text-[9px] font-black uppercase tracking-widest text-stone-400"
                >Genre</span
              >
              <p
                class="text-xs md:text-sm font-bold text-stone-900 uppercase truncate"
              >
                {{ book.genre }}
              </p>
            </div>
            <div class="bg-white p-4 md:p-6">
              <span
                class="text-[9px] font-black uppercase tracking-widest text-stone-400"
                >Publication</span
              >
              <p
                class="text-xs md:text-sm font-bold text-stone-900 uppercase truncate"
              >
                {{ formatDate(book.publication_date) }}
              </p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 space-y-12 lg:space-y-16">
          <section class="space-y-4 md:space-y-6">
            <h2
              class="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-900"
            >
              Archival Details
            </h2>
            <div class="flex justify-between border-b border-stone-100 py-4">
              <span class="text-[10px] md:text-xs uppercase text-stone-400"
                >Date Logged</span
              >
              <span class="text-[10px] md:text-xs text-stone-900 font-medium">{{
                formatDate(book.date_created)
              }}</span>
            </div>
          </section>

          <section class="space-y-8 md:space-y-10">
            <div class="flex items-center justify-between">
              <h2
                class="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-900"
              >
                Public Annotations
              </h2>
              <div class="h-px flex-1 bg-stone-100 ml-4 hidden md:block"></div>
            </div>

            <div
              v-if="commentsLoading"
              class="bg-stone-50 border-[1.5px] border-stone-200 p-8 text-center"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                class="w-6 h-6 animate-spin mx-auto text-stone-400 mb-2"
              />
              <p class="text-xs text-stone-400 uppercase tracking-widest">
                Retrieving data...
              </p>
            </div>

            <div
              v-else-if="canComment === false"
              class="bg-stone-50 border-[1.5px] border-stone-200 p-6 text-center"
            >
              <p class="text-[10px] font-bold uppercase text-stone-500">
                Registry: Comments Disabled
              </p>
            </div>

            <template v-else>
              <CommentForm
                v-if="isAuthenticated"
                ref="commentFormRef"
                :loading="commentsLoading"
                @submit="handleAddComment"
                class="mb-10"
              />
              <div
                v-else
                class="bg-stone-100/50 border-[1.5px] border-stone-900 p-6 text-center"
              >
                <p
                  class="text-[10px] font-black uppercase tracking-widest text-stone-600"
                >
                  Please
                  <NuxtLink
                    to="/login"
                    class="text-stone-900 underline underline-offset-4"
                    >sign in</NuxtLink
                  >
                  to annotate
                </p>
              </div>

              <CommentsList
                :comments="comments"
                :loading="commentsLoading"
                :current-user="currentUser"
                @delete="handleDeleteComment"
              />
            </template>
          </section>
        </div>
      </div>

      <ConfirmDialog
        v-if="showDeleteDialog"
        v-model:is-open="showDeleteDialog"
        title="Confirm Purge"
        message="This action will permanently remove this volume from the archive. This cannot be undone."
        confirm-text="Purge Volume"
        confirm-color="error"
        :loading="deleteLoading"
        @confirm="handleDelete"
        @cancel="cancelDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentForm from "~/components/ui/comment/CommentForm.vue";
import CommentsList from "~/components/ui/comment/CommentsList.vue";
import ConfirmDialog from "~/components/ui/form/ConfirmDialog.vue";
import { useBookComments } from "~/composables/useBookComments";
import { useBooks } from "~/composables/useBooks";
import { useAdmin } from "~/composables/useAdmin";
import type { Book } from "~/schemas";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  title: "Book Details",
});

const route = useRoute();
const bookId = route.params.id as string;
const auth = useAuthStore();
const { isAuthenticated, fullName } = storeToRefs(auth);
const { isAdminUser } = useAdmin();

const { getById, remove, loading: bookLoading } = useBooks();
const {
  comments,
  loading: commentsLoading,
  fetchComments,
  addComment,
  deleteComment,
  canComment,
} = useBookComments(bookId);

const book = ref<Book | null>(null);
const showDeleteDialog = ref(false);
const deleteLoading = ref(false);
const commentFormRef = ref();

const currentUser = computed(() => {
  const user = auth.user;
  if (!user) return undefined;
  return {
    ...user,
    name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User",
    isAdmin: isAdminUser.value,
  };
});

const loadBook = async () => {
  try {
    book.value = await getById(bookId);
  } catch (error) {
    console.error("Failed to load book:", error);
    book.value = null;
  }
};

const handleAddComment = async (data: { content: string }) => {
  try {
    const author = fullName.value ?? "Anonymous";
    await addComment(data.content, author);
    commentFormRef.value?.resetForm();
  } catch (e) {
    console.error("Failed to commit annotation", e);
  }
};

const handleDeleteComment = async (id: string) => {
  try {
    await deleteComment(id);
  } catch (error) {
    console.error("Failed to delete comment:", error);
  }
};

const confirmDelete = () => {
  showDeleteDialog.value = true;
};

const handleDelete = async () => {
  deleteLoading.value = true;
  try {
    await remove(bookId);
    await navigateTo("/books");
  } catch (error) {
    console.error("Failed to delete book:", error);
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
};

const formatDate = (value: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

onMounted(async () => {
  try {
    await Promise.allSettled([loadBook(), fetchComments()]);
  } catch (error) {
    console.error("Failed to load book details:", error);
  }
});
</script>
