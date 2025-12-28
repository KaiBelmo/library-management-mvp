<template>
  <header
    class="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/60"
  >
    <nav class="max-w-7xl mx-auto px-6">
      <div class="flex h-20 items-center justify-between">
        <NuxtLink
          to="/"
          class="group flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-stone-50 shadow-sm transition-transform duration-500 group-hover:rotate-10"
          >
            <UIcon name="i-heroicons-book-open" class="h-5 w-5" />
          </div>
          <div class="flex flex-col">
            <span
              class="font-serif text-xl tracking-tight text-stone-900 leading-none"
              >Librarus</span
            >
            <span
              class="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium"
              >Collection Management</span
            >
          </div>
        </NuxtLink>

        <div class="hidden md:flex items-center gap-10">
            <NuxtLink
              v-for="link in navigation"
              :key="link.path"
              :to="link.path"
              :class="[
                'relative text-sm font-medium transition-all duration-300 py-2',
                $route.path === link.path
                  ? 'text-stone-900'
                  : 'text-stone-400 hover:text-stone-600',
              ]"
            >
              {{ link.label }}
              <span
                v-if="$route.path === link.path"
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-600"
              />
            </NuxtLink>
        </div>

        <div class="flex items-center gap-6">
          <div
            v-if="isAuthenticated"
            class="hidden sm:flex flex-col items-end border-r border-stone-200 pr-6"
          >
            <span
              class="text-[10px] uppercase tracking-widest text-stone-400 font-bold"
              >Librarian</span
            >
            <NuxtLink
              to="/profile"
              class="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span class="text-sm font-semibold text-stone-800">{{ fullName }}</span>
              <div
                v-if="isAdminUser"
                class="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"
                title="Admin Access"
              />
            </NuxtLink>
          </div>

          <div v-else class="hidden sm:flex items-center gap-4">
            <NuxtLink to="/login">
              <button
                class="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors"
              >
                Sign In
              </button>
            </NuxtLink>
            <NuxtLink to="/register">
              <button
                class="px-4 py-2 bg-stone-900 text-stone-50 text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all"
              >
                Register
              </button>
            </NuxtLink>
          </div>

          <button
            class="p-2 text-stone-600 md:hidden hover:bg-stone-100 rounded-full transition-colors"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <UIcon
              :name="
                mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-2'
              "
              class="h-6 w-6"
            />
          </button>
        </div>
      </div>

      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-[-10px] opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-[-10px] opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="absolute left-4 right-4 top-20 md:hidden overflow-hidden rounded-2xl border border-stone-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-stone-200/50 z-50"
        >
          <div class="p-2 flex flex-col gap-1">
            <NuxtLink
              v-for="link in navigation"
              :key="link.path"
              :to="link.path"
              :class="[
                'flex items-center justify-between p-4 rounded-xl font-medium transition-colors',
                $route.path === link.path
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-600 hover:bg-stone-50',
              ]"
              @click="mobileMenuOpen = false"
            >
              {{ link.label }}
              <UIcon
                :name="
                  $route.path === link.path
                    ? 'i-heroicons-check'
                    : 'i-heroicons-chevron-right'
                "
                class="h-4 w-4"
                :class="
                  $route.path === link.path
                    ? 'text-amber-600'
                    : 'text-stone-300'
                "
              />
            </NuxtLink>

            <div
              v-if="!isAuthenticated"
              class="border-t border-stone-100 mt-2 pt-2"
            >
              <NuxtLink
                to="/login"
                class="flex items-center justify-between p-4 rounded-xl font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                @click="mobileMenuOpen = false"
              >
                Sign In
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="h-4 w-4 text-stone-300"
                />
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="flex items-center justify-between p-4 rounded-xl font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                @click="mobileMenuOpen = false"
              >
                Register
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="h-4 w-4 text-stone-300"
                />
              </NuxtLink>
            </div>

            <div v-else class="border-t border-stone-100 mt-2 pt-2">
              <NuxtLink
                to="/profile"
                class="flex items-center justify-between p-4 rounded-xl font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                @click="mobileMenuOpen = false"
              >
                Profile
                <UIcon name="i-heroicons-user" class="h-4 w-4 text-stone-300" />
              </NuxtLink>
              <button
                @click="handleLogout"
                class="flex items-center justify-between w-full p-4 rounded-xl font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Sign Out
                <UIcon
                  name="i-heroicons-arrow-right-on-rectangle"
                  class="h-4 w-4"
                />
              </button>
            </div>
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { onMounted, ref } from 'vue';
import { useNuxtApp } from '#imports';
import { useAdmin } from "~/composables/useAdmin";
import { useAuth } from "~/composables/useAuth";

const { $pinia } = useNuxtApp();
const authStore = useAuthStore($pinia);
const { isAuthenticated, user, fullName, isAdminUser } = storeToRefs(authStore);

const mobileMenuOpen = ref(false);

const navigation = [
  { label: "Collection", path: "/books" },
  { label: "Archiving", path: "/books/new" },
  { label: "Profile", path: "/profile" },
];

const { logout } = useAuth();

const handleLogout = async () => {
  try {
    await logout();
    mobileMenuOpen.value = false;
    navigateTo("/login");
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>
