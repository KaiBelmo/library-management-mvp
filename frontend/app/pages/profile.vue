<template>
  <div class="max-w-4xl mx-auto px-6 py-10 selection:bg-stone-900 selection:text-white">
    <div class="space-y-16">
      <ProfileHeader @logout="handleLogout" :is-admin="isAdminUser" />

      <template v-if="isAdminUser">
        <AdminStats :stats="adminStats" />
      </template>
      
      <ProfileUpdateForm v-show="isAuthenticated" :form="form" :pending="pending" :status-msg="statusMsg"
        :is-error="isError" :expanded="profileFormExpanded" @update="handleUpdate"
        @toggle-expanded="toggleProfileFormExpanded" />

      <template v-if="isAdminUser">
        <AdminUserDirectory :users="allUsers" :expanded="adminDirectoryExpanded"
          @toggle-expanded="toggleAdminDirectoryExpanded" />
      </template>

      <UserBooksSection v-if="isAuthenticated" :books="userBooks" :loading="userBooksLoading" :paginating="paginating"
        :pagination="userBooksPagination" :expanded="expanded" @toggle-expanded="toggleUserBooksExpanded"
        @navigate-book="navigateToBook" @set-page="setUserBooksPageHandler" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth"
import { UpdateProfileSchema } from "~/utils/schemas"
import ProfileHeader from "~/components/ui/profile/ProfileHeader.vue"
import AdminStats from "~/components/ui/profile/AdminStats.vue"
import AdminUserDirectory from "~/components/ui/profile/AdminUserDirectory.vue"
import ProfileUpdateForm from "~/components/ui/profile/ProfileUpdateForm.vue"
import UserBooksSection from "~/components/ui/profile/UserBooksSection.vue"

definePageMeta({
  title: "Personnel Dossier",
  middleware: ['auth'],
})

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { logout } = useAuth()
const userComposable = useUser()
const adminComposable = useAdmin()
const booksComposable = useBooks()
const { pending, validate, runAction } = useForm(UpdateProfileSchema)

const {
  isAuthenticated,
  updateProfile,
} = userComposable

const {
  allUsers,
  adminStats,
  isAdminUser,
  loadRegistryData,
} = adminComposable

const {
  userBooks,
  userBooksLoading,
  paginating,
  userBooksPagination,
  expanded,
  loadUserBooks,
  setUserBooksPage,
  toggleUserBooksExpanded,
} = booksComposable

const statusMsg = ref("")
const isError = ref(false)
const profileFormExpanded = ref(true)
const adminDirectoryExpanded = ref(true)

const form = reactive({
  first_name: user.value?.first_name || "",
  last_name: user.value?.last_name || "",
  email: user.value?.email || "",
  password: "",
})

const resetStatusMessages = () => {
  statusMsg.value = ""
  isError.value = false
}

const setSuccessMessage = (message: string) => {
  statusMsg.value = message
  isError.value = false
}

const setErrorMessage = (message: string) => {
  statusMsg.value = message
  isError.value = true
}

const resetPassword = () => {
  form.password = ""
}

const toggleProfileFormExpanded = () => {
  profileFormExpanded.value = !profileFormExpanded.value
}

const toggleAdminDirectoryExpanded = () => {
  adminDirectoryExpanded.value = !adminDirectoryExpanded.value
}

const handleUpdate = async () => {
  if (!user.value?.id) return

  resetStatusMessages()

  const profileData = {
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email,
    password: form.password || undefined,
  }

  if (!validate(profileData)) {
    setErrorMessage("INVALID DATA")
    return
  }

  await runAction(async () => {
    await updateProfile(user.value!.id, profileData)
    setSuccessMessage("DOSSIER UPDATED.")
    resetPassword()
  })
}

const setUserBooksPageHandler = async (page: number) => {
  if (!user.value?.id) return
  await setUserBooksPage(page, user.value.id)
}

const navigateToBook = (id: string) => {
  navigateTo(`/books/${id}`)
}

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    navigateTo("/login")
  }
}

onMounted(async () => {
  try {
    const promises = [loadRegistryData()]

    if (user.value?.id) {
      promises.push(loadUserBooks(user.value.id))
    }

    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Failed to load profile data:', error)
  }
})
</script>
