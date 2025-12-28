<template>
  <AuthLayout
    icon="i-heroicons-key"
    title="Curator Login"
    subtitle="Secure Archive Access / Protocol 01"
    :error="errorMessage"
    :success="successMessage"
  >
    <form @submit.prevent="handleLogin" class="space-y-8">
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
        class="w-full bg-stone-900 text-stone-50 py-4 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 disabled:opacity-50 transition-opacity"
      >
        <span v-if="pending">Verifying...</span>
        <span v-else>Authorize Access</span>
        <UIcon
          :name="pending ? 'i-heroicons-arrow-path' : 'i-heroicons-lock-closed'"
          :class="{ 'animate-spin': pending }"
          class="w-3 h-3"
        />
      </button>

      <div class="text-center pt-2">
        <NuxtLink
          to="/register"
          class="text-[9px] font-black uppercase text-stone-400 hover:text-stone-900 underline underline-offset-8"
        >
          New Librarian? Request Access
        </NuxtLink>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthInput from "~/components/auth/AuthInput.vue";
import AuthLayout from "~/components/auth/AuthLayout.vue";
import { loginSchema } from "~/schemas";
import type { LoginCredentials } from "~/types";

definePageMeta({
  layout: false,
  title: "Archive Login",
});

const { login } = useAuth();
const { pending, errorMessage, successMessage, errors, validate, runAction } =
  useAuthForm<LoginCredentials>(loginSchema);

const form = reactive<LoginCredentials>({ email: "", password: "" });

const handleLogin = async () => {
  if (!validate(form)) return;
  await runAction(async () => {
    await login(form);
    successMessage.value = "ACCESS GRANTED. REDIRECTING...";
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
