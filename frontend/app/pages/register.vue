<template>
  <div
    class="min-h-screen bg-white flex items-center justify-center px-6 selection:bg-stone-900 selection:text-white"
  >
    <div class="w-full max-w-md animate-fade-in">
      <div class="text-center mb-12">
        <div
          class="inline-flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-stone-900 bg-white text-stone-900 mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <UIcon name="i-heroicons-user-plus" class="h-6 w-6" />
        </div>
        <h1
          class="font-serif text-4xl text-stone-900 italic tracking-tighter mb-2 leading-none"
        >
          Request Access
        </h1>
        <p
          class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400"
        >
          Librarian Registration / Protocol 02
        </p>
      </div>

      <div
        class="border-[1.5px] border-stone-900 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)] mb-14 relative"
      >
        <div class="absolute top-0 left-0 w-full h-0.75 bg-stone-900"></div>

        <div class="p-8 md:p-10 space-y-8">
          <div
            v-if="errorMessage"
            class="p-4 border-[1.5px] border-red-600 bg-red-50 text-red-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
          >
            <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
            {{ errorMessage }}
          </div>

          <div
            v-if="successMessage"
            class="p-4 border-[1.5px] border-stone-900 bg-stone-50 text-stone-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
          >
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
            {{ successMessage }}
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
            <div>
              <label
                class="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3"
              >
                First Name
              </label>
              <UInput
                v-model="form.first_name"
                type="text"
                placeholder="Ex: Julian"
                size="lg"
                variant="none"
                :disabled="pending"
                class="w-full border-b-[1.5px] text-black border-stone-200 focus:border-stone-900 transition-colors rounded-none px-0 py-2"
                :class="{ 'opacity-50': pending }"
                :ui="{ base: '!text-black placeholder:!text-stone-400' }"
              />
              <p
                v-if="errors.first_name"
                class="text-red-600 text-[9px] font-black uppercase mt-1"
              >
                {{ errors.first_name }}
              </p>
            </div>

            <div>
              <label
                class="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3"
              >
                Last Name
              </label>
              <UInput
                v-model="form.last_name"
                type="text"
                placeholder="Ex: Barnes"
                size="lg"
                variant="none"
                :disabled="pending"
                class="w-full border-b-[1.5px] text-black border-stone-200 focus:border-stone-900 transition-colors rounded-none px-0 py-2"
                :class="{ 'opacity-50': pending }"
                :ui="{ base: '!text-black placeholder:!text-stone-400' }"
              />
              <p
                v-if="errors.last_name"
                class="text-red-600 text-[9px] font-black uppercase mt-1"
              >
                {{ errors.last_name }}
              </p>
            </div>

            <div>
              <label
                class="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3"
              >
                Registry Email
              </label>
              <UInput
                v-model="form.email"
                type="email"
                placeholder="librarian@atheneum.library"
                size="lg"
                variant="none"
                :disabled="pending"
                class="w-full border-b-[1.5px] text-black border-stone-200 focus:border-stone-900 transition-colors rounded-none px-0 py-2"
                :class="{ 'opacity-50': pending }"
                :ui="{ base: '!text-black placeholder:!text-stone-400' }"
              />
              <p
                v-if="errors.email"
                class="text-red-600 text-[9px] font-black uppercase mt-1"
              >
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label
                class="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3"
              >
                Access Code
              </label>
              <UInput
                v-model="form.password"
                type="password"
                placeholder="Minimum 6 characters"
                size="lg"
                variant="none"
                :disabled="pending"
                class="w-full border-b-[1.5px] text-black border-stone-200 focus:border-stone-900 transition-colors rounded-none px-0 py-2"
                :class="{ 'opacity-50': pending }"
                :ui="{ base: '!text-black placeholder:!text-stone-400' }"
              />
              <p
                v-if="errors.password"
                class="text-red-600 text-[9px] font-black uppercase mt-1"
              >
                {{ errors.password }}
              </p>
            </div>

            <div class="pt-4">
              <button
                type="submit"
                :disabled="pending"
                class="w-full bg-stone-900 text-stone-50 py-4 text-[10px] font-black uppercase tracking-[0.4em] disabled:bg-stone-300 disabled:text-stone-500 transition-all flex items-center justify-center gap-3"
              >
                <span v-if="pending">Processing...</span>
                <span v-else>Submit Request</span>
                <UIcon
                  v-if="pending"
                  name="i-heroicons-arrow-path"
                  class="w-3 h-3 animate-spin"
                />
                <UIcon
                  v-else
                  name="i-heroicons-paper-airplane"
                  class="w-3 h-3"
                />
              </button>
            </div>
          </form>

          <div class="text-center pt-2">
            <NuxtLink
              to="/login"
              class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 underline underline-offset-8 transition-colors"
            >
              Existing Curator? Sign In
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import { RegisterSchema, type RegisterInput } from "~/utils/schemas";

definePageMeta({
  layout: false,
  title: "Request Access",
  // This prevents logged-in users from seeing the register page
  middleware: [
    function () {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) return navigateTo("/");
    },
  ],
});

const { createUser } = useDirectusAuth();
const authStore = useAuthStore();
const { registerAndLogin } = useAuth();

const form = reactive<RegisterInput>({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
});

const errors = ref<Partial<Record<keyof RegisterInput, string>>>({});
const errorMessage = ref("");
const successMessage = ref("");
const pending = ref(false);

const handleRegister = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  errors.value = {};

  const result = RegisterSchema.safeParse(form);
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const path = issue.path[0] as keyof RegisterInput;
      errors.value[path] = issue.message;
    });
    return;
  }

  pending.value = true;

  try {
    await registerAndLogin(form);

    successMessage.value = "ACCESS GRANTED. REDIRECTING...";

    Object.assign(form, {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    });

    setTimeout(async () => {
      await navigateTo('/', { external: true });
    }, 1500);
  } catch (error: any) {
    console.error("Registration Flow Error:", error);

    if (error.data?.errors) {
      const code = error.data.errors[0].extensions?.code;
      const msg = error.data.errors[0].message;
      errorMessage.value = `[${code}]: ${msg}`;
    } else {
      errorMessage.value = error.message || "An unexpected error occurred.";
    }
  } finally {
    pending.value = false;
  }
};
</script>
<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
