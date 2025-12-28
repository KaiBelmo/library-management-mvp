<template>
  <AuthLayout
    icon="i-heroicons-user-plus"
    title="Request Access"
    subtitle="Librarian Registration / Protocol 02"
    :error="errorMessage"
    :success="successMessage"
  >
    <form @submit.prevent="handleRegister" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <AuthInput
          v-model="form.first_name"
          label="First Name"
          placeholder="John"
          :error="errors.first_name"
          :disabled="pending"
        />
        <AuthInput
          v-model="form.last_name"
          label="Last Name"
          placeholder="Doe"
          :error="errors.last_name"
          :disabled="pending"
        />
      </div>

      <AuthInput
        v-model="form.email"
        label="Registry Email"
        placeholder="archivist@library.org"
        type="email"
        :error="errors.email"
        :disabled="pending"
      />

      <AuthInput
        v-model="form.password"
        label="Access Code"
        placeholder="••••••••"
        type="password"
        :error="errors.password"
        :disabled="pending"
      />

      <button
        type="submit"
        :disabled="pending"
        class="w-full bg-stone-900 text-stone-50 py-4 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 disabled:opacity-50"
      >
        <span v-if="pending">Processing...</span>
        <span v-else>Submit Request</span>
        <UIcon
          :name="
            pending ? 'i-heroicons-arrow-path' : 'i-heroicons-paper-airplane'
          "
          :class="{ 'animate-spin': pending }"
          class="w-3 h-3"
        />
      </button>

      <div class="text-center pt-2">
        <NuxtLink
          to="/login"
          class="text-[9px] font-black uppercase text-stone-400 hover:text-stone-900 underline underline-offset-8"
        >
          Existing Curator? Sign In
        </NuxtLink>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthInput from "~/components/auth/AuthInput.vue";
import AuthLayout from "~/components/auth/AuthLayout.vue";
import { registerSchema } from "~/schemas";

definePageMeta({
  layout: false,
  title: "Archive Register",
});

const { registerAndLogin } = useAuth();
const { pending, errorMessage, successMessage, errors, validate, runAction } =
  useAuthForm(registerSchema);

const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
});

const handleRegister = async () => {
  if (!validate(form)) return;
  await runAction(async () => {
    await registerAndLogin(form);
    successMessage.value = "REGISTRY CREATED. REDIRECTING...";
    setTimeout(
      () =>
        navigateTo("/", {
          external: true,
        }),
      1000
    );
  });
};
</script>
