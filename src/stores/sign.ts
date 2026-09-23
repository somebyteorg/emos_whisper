import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useSignStore = defineStore(
  'sign',
  () => {
    const username = ref('')
    const avatar = ref<string | null>(null)
    const user_token = ref('')

    const isSignedIn = computed(() => Boolean(user_token.value))

    function setToken(token: string) {
      user_token.value = token
    }

    async function signOut() {
      username.value = ''
      avatar.value = null
      user_token.value = ''
    }

    return {
      username,
      avatar,
      user_token,
      isSignedIn,
      setToken,
      signOut,
    }
  },
  {
    persist: true,
  },
)

export default useSignStore
