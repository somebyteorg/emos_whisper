import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import api, { PREFIX_URL } from '@/utils/ky'
import { useSignStore } from '@/stores/sign'
import type { UserProfile, Whisper, WhisperDraft, WhisperTab } from '@/types/whisper'
import { getApiErrorMessage } from '@/utils/api-error'

type NoticeType = 'success' | 'error'

const DRAFT_STORAGE_KEY = 'emos-whisper-draft'

export function useWhispers() {
  const signStore = useSignStore()
  const { isSignedIn, username, avatar } = storeToRefs(signStore)
  const draft = useStorage<WhisperDraft>(DRAFT_STORAGE_KEY, {
    receiverUserId: '',
    content: '',
    isAnonymous: false,
  })

  const activeTab = ref<WhisperTab>('write')
  const profileLoading = ref(false)
  const sentWhispers = ref<Whisper[]>([])
  const receivedWhispers = ref<Whisper[]>([])
  const replyDrafts = reactive<Record<number, string>>({})
  const sentLoading = ref(false)
  const receivedLoading = ref(false)
  const sentLoaded = ref(false)
  const receivedLoaded = ref(false)
  const sending = ref(false)
  const replyingTo = ref<number | null>(null)
  const notice = ref('')
  const noticeType = ref<NoticeType>('success')

  const activeWhispers = computed(() => (activeTab.value === 'received' ? receivedWhispers.value : sentWhispers.value))
  const activeListLoading = computed(() => (activeTab.value === 'received' ? receivedLoading.value : sentLoading.value))
  function showNotice(message: string, type: NoticeType = 'success') {
    notice.value = message
    noticeType.value = type
  }

  function clearNotice() {
    notice.value = ''
  }

  function signIn() {
    window.location.assign(`${PREFIX_URL}api/sign?state=emos_whisper`)
  }

  async function loadProfile() {
    if (!isSignedIn.value) return

    profileLoading.value = true
    try {
      const profile = await api.get('api/user/base').json<UserProfile>()
      username.value = profile.username
      avatar.value = profile.avatar
    } catch (error) {
      showNotice(await getApiErrorMessage(error, '没认出你，再试一次？'), 'error')
    } finally {
      profileLoading.value = false
    }
  }

  async function loadSent() {
    if (!isSignedIn.value) return

    sentLoading.value = true
    try {
      sentWhispers.value = await api.get('api/whisper/sender').json<Whisper[]>()
      sentLoaded.value = true
    } catch (error) {
      showNotice(await getApiErrorMessage(error, '这次没找到你寄出的话。'), 'error')
    } finally {
      sentLoading.value = false
    }
  }

  async function loadReceived() {
    if (!isSignedIn.value) return

    receivedLoading.value = true
    try {
      receivedWhispers.value = await api.get('api/whisper/receiver').json<Whisper[]>()
      for (const whisper of receivedWhispers.value) {
        replyDrafts[whisper.whisper_id] ??= ''
      }
      receivedLoaded.value = true
    } catch (error) {
      showNotice(await getApiErrorMessage(error, '这次没找到落在你手里的话。'), 'error')
    } finally {
      receivedLoading.value = false
    }
  }

  async function selectTab(tab: WhisperTab) {
    activeTab.value = tab
    clearNotice()

    if (tab === 'sent' && !sentLoaded.value) await loadSent()
    if (tab === 'received' && !receivedLoaded.value) await loadReceived()
  }

  async function refreshActiveList() {
    if (activeTab.value === 'sent') await loadSent()
    if (activeTab.value === 'received') await loadReceived()
  }

  async function sendWhisper() {
    const receiverUserId = draft.value.receiverUserId.trim()
    const content = draft.value.content.trim()

    if (receiverUserId.length !== 10) {
      showNotice('这个 ID 好像没写对，再检查一下？', 'error')
      return
    }

    if (!content) {
      showNotice('还差一句想说的话。', 'error')
      return
    }

    if (!isSignedIn.value) {
      signIn()
      return
    }

    sending.value = true
    clearNotice()
    try {
      await api
        .post('api/whisper/create', {
          json: {
            receiver_user_id: receiverUserId,
            content,
            is_anonymous: draft.value.isAnonymous,
          },
        })
        .json<{ whisper_id: number }>()

      draft.value.content = ''
      draft.value.isAnonymous = false
      sentLoaded.value = false
      showNotice('好啦，这句话已经悄悄送到了。')
      if (activeTab.value === 'sent') await loadSent()
    } catch (error) {
      showNotice(await getApiErrorMessage(error, '这句话没能送出去，再试一次？'), 'error')
    } finally {
      sending.value = false
    }
  }

  async function replyToWhisper(whisper: Whisper) {
    const content = (replyDrafts[whisper.whisper_id] ?? '').trim()
    if (!content) {
      showNotice('回一句再送出吧。', 'error')
      return
    }

    replyingTo.value = whisper.whisper_id
    clearNotice()
    try {
      await api
        .post('api/whisper/reply', {
          json: {
            whisper_id: whisper.whisper_id,
            content,
          },
        })
        .json<{ whisper_id: number }>()

      replyDrafts[whisper.whisper_id] = ''
      showNotice('你的回复已经悄悄送回去了。')
      await loadReceived()
    } catch (error) {
      showNotice(await getApiErrorMessage(error, '回复没能送出去，再试一次？'), 'error')
    } finally {
      replyingTo.value = null
    }
  }

  async function signOut() {
    await signStore.signOut()
    sentWhispers.value = []
    receivedWhispers.value = []
    sentLoaded.value = false
    receivedLoaded.value = false
    activeTab.value = 'write'
    showNotice('先把话收好啦。')
  }

  watch(isSignedIn, (signedIn) => {
    if (signedIn) return

    activeTab.value = 'write'
    sentWhispers.value = []
    receivedWhispers.value = []
    sentLoaded.value = false
    receivedLoaded.value = false
  })

  onMounted(() => {
    if (isSignedIn.value) {
      void Promise.all([loadProfile(), loadSent(), loadReceived()])
    }
  })

  return {
    activeListLoading,
    activeTab,
    activeWhispers,
    avatar,
    clearNotice,
    draft,
    isSignedIn,
    notice,
    noticeType,
    profileLoading,
    receivedLoaded,
    receivedWhispers,
    replyDrafts,
    replyingTo,
    sentLoaded,
    selectTab,
    sendWhisper,
    sentWhispers,
    signIn,
    signOut,
    username,
    refreshActiveList,
    replyToWhisper,
    sending,
  }
}
