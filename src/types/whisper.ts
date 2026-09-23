export type WhisperUser = {
  id?: string
  user_id?: string
  username: string
  avatar: string | null
}

export type Whisper = {
  whisper_id: number
  sender_content: string
  sender_is_anonymous?: boolean
  sender_at: string
  sender_user?: WhisperUser | null
  receiver_user?: WhisperUser | null
  receiver_content: string | null
  receiver_at: string | null
}

export type UserProfile = {
  user_id: string
  username: string
  avatar: string | null
}

export type WhisperDraft = {
  receiverUserId: string
  content: string
  isAnonymous: boolean
}

export type WhisperTab = 'write' | 'received' | 'sent'
