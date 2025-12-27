<template>
  <div class="border-[1.5px] border-stone-900 bg-white flex flex-col selection:bg-stone-900 selection:text-white transition-all duration-500 ease-in-out">
    
    <div 
      @click="isCollapsed = !isCollapsed" 
      class="bg-stone-50 border-b border-stone-900 flex items-center justify-between p-4 cursor-pointer group hover:bg-stone-100 transition-colors"
    >
      <div class="flex items-center gap-3">
        <span 
          class="text-[10px] transition-transform duration-500"
          :class="{ 'rotate-180': isCollapsed }"
        >
          ▼
        </span>
        <h3 class="text-[9px] font-black uppercase tracking-widest text-stone-900">
          Personnel Registry
        </h3>
      </div>
      <span class="text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:text-black transition-colors">
        {{ isCollapsed ? '[ + EXPAND ]' : '[ - COLLAPSE ]' }}
      </span>
    </div>

    <div 
      class="grid transition-[grid-template-rows,opacity] duration-500 ease-in-out"
      :class="isCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'"
    >
      <div class="overflow-hidden">
        <div class="h-[520px] flex flex-col">
          
          <div class="flex-1 overflow-y-auto custom-scrollbar">
            <table class="w-full border-collapse">

              <tbody>
                <template v-for="u in paginatedUsers" :key="u.id">
                  <tr
                    @click="toggleUser(u.id)"
                    class="cursor-pointer border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td class="p-4 text-sm font-medium text-stone-900">
                      {{ u.first_name }} {{ u.last_name }}
                    </td>
                    <td class="p-4 font-mono text-[11px] text-stone-500">
                      {{ u.email }}
                    </td>
                  </tr>

                  <tr v-if="expandedUserId === u.id">
                    <td colspan="2" class="p-6 bg-stone-50 border-b border-stone-200">
                      <div class="grid grid-cols-2 gap-6 text-[11px]">
                        <div>
                          <p class="font-black uppercase tracking-widest text-stone-400">User ID</p>
                          <p class="font-mono text-stone-700 mt-1">{{ u.id }}</p>
                        </div>
                        <div>
                          <p class="font-black uppercase tracking-widest text-stone-400">Email</p>
                          <p class="mt-1 text-stone-700">{{ u.email }}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>

                <tr v-if="!paginatedUsers.length">
                  <td colspan="2" class="p-8 text-center text-[11px] text-stone-400 italic">
                    No personnel records found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex items-center justify-between px-6 py-4 border-t border-stone-900 bg-white mt-auto text-black">
            <button
              @click.stop="prevPage"
              :disabled="currentPage === 1"
              class="text-[10px] font-black uppercase tracking-widest hover:text-stone-500 disabled:opacity-20 transition-opacity"
            >
              Previous
            </button>

            <div class="flex flex-col items-center">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] text-stone-300 mb-1">Dossier Registry</p>
              <p class="text-[10px] font-mono text-stone-500">
                SEC_{{ currentPage.toString().padStart(2, '0') }} / {{ totalPages.toString().padStart(2, '0') }}
              </p>
            </div>

            <button
              @click.stop="nextPage"
              :disabled="currentPage === totalPages"
              class="text-[10px] font-black uppercase tracking-widest hover:text-stone-500 disabled:opacity-20 transition-opacity"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

const props = defineProps<{
  allUsers: User[]
}>()

const isCollapsed = ref(false)

const expandedUserId = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 8

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.allUsers.length / pageSize))
)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return props.allUsers.slice(start, start + pageSize)
})

const toggleUser = (id: string) => {
  expandedUserId.value = expandedUserId.value === id ? null : id
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    expandedUserId.value = null
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    expandedUserId.value = null
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: black; 
}
</style>