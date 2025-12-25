<template>
  <div
    class="max-w-4xl mx-auto px-6 py-10 selection:bg-stone-900 selection:text-white"
  >
    <div class="space-y-16">
      <header class="border-b-[1.5px] border-stone-900 pb-12">
        <div class="flex flex-col md:flex-row justify-between items-end gap-8">
          <div class="space-y-4">
            <p
              class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400"
            >
              Registry Personnel
            </p>
            <h1
              class="font-serif text-5xl md:text-6xl text-stone-900 italic tracking-tighter leading-none"
            >
              Personnel Dossier
            </h1>
          </div>
          <button
            @click="handleLogout"
            class="group flex items-center gap-2 px-6 py-3 border-[1.5px] border-stone-900 text-[10px] font-black uppercase tracking-widest text-stone-900 hover:bg-rose-600 hover:text-white transition-all"
          >
            Terminate Session <UIcon name="i-heroicons-power" class="w-3 h-3" />
          </button>
        </div>
      </header>

      <div
        v-show="authStore.status === 'authenticated'"
        class="p-10 border-[1.5px] border-stone-900 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.03)]"
      >
        <form @submit.prevent="handleUpdate" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-stone-400"
                >Given Name</label
              >
              <input
                v-model="form.first_name"
                type="text"
                class="w-full bg-stone-50 border border-stone-200 p-3 outline-none text-black focus:border-stone-900 transition-all"
              />
            </div>

            <div class="space-y-2">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-stone-400"
                >Surname</label
              >
              <input
                v-model="form.last_name"
                type="text"
                class="w-full bg-stone-50 border border-stone-200 p-3 outline-none text-black focus:border-stone-900 transition-all"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div class="space-y-2">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-stone-400"
                >Email Address</label
              >
              <input
                v-model="form.email"
                type="email"
                class="w-full bg-stone-50 border border-stone-200 p-3 outline-none text-black focus:border-stone-900 transition-all"
              />
            </div>

            <div class="space-y-2">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-stone-400"
                >New Password</label
              >
              <input
                v-model="form.password"
                type="password"
                class="w-full bg-stone-50 border border-stone-200 p-3 outline-none text-black focus:border-stone-900 transition-all"
              />
            </div>
          </div>

          <div
            class="flex flex-col md:flex-row justify-between items-center pt-6 gap-4"
          >
            <p
              v-if="statusMsg"
              :class="isError ? 'text-rose-600' : 'text-emerald-600'"
              class="text-[10px] font-bold uppercase tracking-widest"
            >
              {{ statusMsg }}
            </p>
            <div v-else></div>

            <button
              type="submit"
              :disabled="pending"
              class="w-full md:w-auto px-10 py-4 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-[0.4em] disabled:bg-stone-300"
            >
              {{ pending ? "Updating..." : "Commit Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { UpdateProfileSchema } from "~/utils/schemas";

definePageMeta({
  title: "Personnel Dossier",
  middleware: [
    function () {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return navigateTo("/login");
    },
  ],
});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { updateUser } = useDirectusUsers();
const { logout } = useDirectusAuth();

const pending = ref(false);
const statusMsg = ref("");
const isError = ref(false);

const form = reactive({
  first_name: user.value?.first_name || "",
  last_name: user.value?.last_name || "",
  email: user.value?.email || "",
  password: "",
});

const handleUpdate = async () => {
  if (!user.value?.id) return;

  const result = UpdateProfileSchema.safeParse({
    first_name: form.first_name || undefined,
    last_name: form.last_name || undefined,
    email: form.email || undefined,
    password: form.password || undefined,
  });
  if (!result.success) {
    const issue = result.error.issues[0];
    statusMsg.value =
      issue?.message ?? "Invalid input. Please check your data.";
    isError.value = true;
    return;
  }
  try {
    await updateUser({
      id: user.value.id,
      user: {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        ...(form.password ? { password: form.password } : {}),
      },
    });

    if (authStore.user) {
      authStore.user.first_name = form.first_name;
      authStore.user.last_name = form.last_name;
      authStore.user.email = form.email;
    }
    statusMsg.value = "DOSSIER UPDATED: REGISTRY SYNCHRONIZED.";
    isError.value = false;
    form.password = "";
  } catch (error: any) {
    statusMsg.value = "ERROR: UPDATE REJECTED BY CORE.";
    isError.value = true;
  } finally {
    pending.value = false;
  }
};

const handleLogout = async () => {
  await logout();
  authStore.$reset();
  await navigateTo("/login");
};
</script>
