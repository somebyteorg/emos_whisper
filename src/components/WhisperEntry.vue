<script lang="ts" setup>
import type {Whisper, WhisperTab} from '@/types/whisper'
import {formatWhisperDate} from '@/utils/whisper-date'

defineProps<{
    whisper: Whisper
    tab: WhisperTab
    replyDraft: string
    replying: boolean
}>()

const emit = defineEmits<{
    'update:replyDraft': [value: string]
    reply: []
}>()
</script>

<template>
    <article class="whisper-entry">
        <div class="entry-meta">
            <span class="entry-person">
                {{ tab === 'received'
                    ? (whisper.sender_user ? `来自 ${whisper.sender_user.username}` : '来自一个匿名的人')
                    : (whisper.sender_is_anonymous ? '你选择不署名' : `写给 ${whisper.receiver_user?.username || '一个人'}`) }}
            </span>
            <time :datetime="whisper.sender_at">{{ formatWhisperDate(whisper.sender_at) }}</time>
        </div>

        <p class="entry-content">{{ whisper.sender_content }}</p>

        <div v-if="whisper.receiver_content" class="reply-note">
            <div class="reply-meta">
                <span>{{ tab === 'received' ? '你回过了' : 'TA 回了你' }}</span>
                <time v-if="whisper.receiver_at" :datetime="whisper.receiver_at">{{ formatWhisperDate(whisper.receiver_at) }}</time>
            </div>
            <p>{{ whisper.receiver_content }}</p>
        </div>

        <form v-else-if="tab === 'received' && !whisper.receiver_at" class="reply-form" @submit.prevent="emit('reply')">
            <label :for="`reply-${whisper.whisper_id}`" class="field-label">回一句给 TA</label>
            <textarea
                :id="`reply-${whisper.whisper_id}`"
                :value="replyDraft"
                class="reply-input"
                maxlength="200"
                placeholder="轻轻回一句…"
                required
                rows="2"
                @input="emit('update:replyDraft', ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
            <div class="reply-actions">
                <span>{{ replyDraft.length }} / 200</span>
                <button :disabled="replying || !replyDraft.trim()" class="reply-button" type="submit">
                    {{ replying ? '送回去…' : '悄悄回复 ↗' }}
                </button>
            </div>
        </form>
        <div v-else class="waiting-note"><span aria-hidden="true">·</span> {{ whisper.receiver_at ? '这段悄悄话已经说完啦。' : '还没有回音' }}</div>
    </article>
</template>

<style scoped>
.whisper-entry {
    padding: 19px 0 21px;
    border-top: 1px solid #dfe9e1;
}

.entry-meta,
.reply-meta,
.reply-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.entry-person {
    color: #618071;
    font-size: 11px;
    font-weight: 700;
}

.entry-meta time,
.reply-meta time {
    color: #a2afa7;
    font-size: 10px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.entry-content {
    margin: 11px 0 0;
    color: #294d41;
    font-size: 14px;
    line-height: 1.8;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
}

.reply-note {
    margin-top: 15px;
    padding: 12px 14px;
    border-left: 2px solid #e8b755;
    background: #f0f6f0;
}

.reply-meta span {
    color: #8d9b72;
    font-size: 10px;
    font-weight: 700;
}

.reply-note p {
    margin: 7px 0 0;
    color: #3c6655;
    font-size: 12px;
    line-height: 1.7;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
}

.reply-form {
    margin-top: 15px;
}

.field-label {
    color: #436357;
    font-size: 12px;
    font-weight: 700;
}

.reply-input {
    width: 100%;
    min-height: 67px;
    margin-top: 8px;
    padding: 9px 11px;
    resize: vertical;
    border: 1px solid #dce8df;
    border-radius: 5px;
    outline: 0;
    background: #fbfdfb;
    color: #234b3e;
    font: inherit;
    font-size: 12px;
    line-height: 1.75;
    transition: border-color 140ms ease, box-shadow 140ms ease;
}

.reply-input::placeholder {
    color: #abb8b0;
}

.reply-input:focus {
    border-color: #89ae99;
    box-shadow: 0 0 0 3px rgb(104 157 125 / 10%);
}

.reply-actions {
    margin-top: 7px;
    color: #9aa89f;
    font-size: 10px;
}

.reply-button {
    padding: 6px 10px;
    border: 0;
    border-radius: 4px;
    background: #e9b65d;
    color: #3f4f39;
    cursor: pointer;
    font: inherit;
    font-size: 11px;
    font-weight: 700;
}

.reply-button:hover:not(:disabled) {
    background: #e2a744;
}

.reply-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.waiting-note {
    margin-top: 15px;
    color: #a0aaa4;
    font-size: 11px;
}

.waiting-note span {
    margin-right: 5px;
    color: #e2ad50;
    font-size: 18px;
    vertical-align: -1px;
}

@media (max-width: 560px) {
    .entry-meta {
        align-items: flex-start;
    }
}
</style>
