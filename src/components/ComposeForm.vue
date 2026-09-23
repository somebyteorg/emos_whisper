<script lang="ts" setup>
import {computed} from 'vue'
import type {WhisperDraft} from '@/types/whisper'

const props = defineProps<{
    draft: WhisperDraft
    signedIn: boolean
    sending: boolean
}>()

const emit = defineEmits<{
    send: []
}>()

const characterCount = computed(() => props.draft.content.length)
const receiverIdIsValid = computed(() => props.draft.receiverUserId.trim().length === 10)
</script>

<template>
    <section aria-labelledby="compose-title" class="compose-panel">
        <div class="section-heading">
            <div>
                <p class="section-kicker">01 <span>/</span> 一封新私语</p>
                <h2 id="compose-title">这次想告诉 TA 什么？</h2>
            </div>
            <span aria-hidden="true" class="hand-note">只给 TA 看 <span>♡</span></span>
        </div>

        <form class="compose-form" @submit.prevent="emit('send')">
            <label class="field-label" for="receiver-id">写给谁 <span>对方的用户 ID</span></label>
            <div class="recipient-field">
                <span aria-hidden="true" class="at-mark">@</span>
                <input
                    id="receiver-id"
                    v-model="draft.receiverUserId"
                    :aria-describedby="draft.receiverUserId.length > 0 && !receiverIdIsValid ? 'recipient-hint' : undefined"
                    :aria-invalid="draft.receiverUserId.length > 0 && !receiverIdIsValid"
                    autocapitalize="off"
                    autocomplete="off"
                    maxlength="10"
                    name="receiver_user_id"
                    placeholder="贴上 TA 的用户 ID"
                    required
                    spellcheck="false"
                />
            </div>
            <p v-if="draft.receiverUserId && !receiverIdIsValid" id="recipient-hint" class="field-hint-error" role="status">这个 ID 还没对上，再核对一下。</p>

            <div class="message-label-row">
                <label class="field-label" for="whisper-content">你想说的话</label>
                <span :class="{ 'count-near-limit': characterCount > 180 }" class="character-count">{{ characterCount }}<span> / 200</span></span>
            </div>
            <textarea
                id="whisper-content"
                v-model="draft.content"
                class="message-input"
                maxlength="200"
                name="content"
                placeholder="想说什么，就写在这里。"
                required
                rows="5"
            ></textarea>

            <div class="form-bottom">
                <label class="anonymous-toggle">
                    <input v-model="draft.isAnonymous" name="is_anonymous" type="checkbox"/>
                    <span aria-hidden="true" class="toggle-track"><span></span></span>
                    <span class="toggle-copy">
                        <strong>{{ draft.isAnonymous ? '匿名寄出' : '署名寄出' }}</strong>
                        <small>{{ draft.isAnonymous ? 'TA 不会知道是你' : '让 TA 知道是你' }}</small>
                    </span>
                </label>
                <button :disabled="sending || !receiverIdIsValid || !draft.content.trim()" class="send-button" type="submit">
                    <span>{{ sending ? '正在递过去…' : signedIn ? '悄悄送出去' : '登录后递出去' }}</span>
                    <span aria-hidden="true" class="send-arrow">↗</span>
                </button>
            </div>
            <p class="form-footnote">{{ signedIn ? '送出后，可以在「说过的」里找到它。' : '先把这句话留在这里，登录后再递给 TA。' }}</p>
        </form>
    </section>
</template>

<style scoped>
.section-heading {
    margin-bottom: 27px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
}

.section-kicker {
    margin: 0 0 9px;
    color: #9baaa1;
    font-size: 10px;
    font-weight: 750;
    text-transform: uppercase;
}

.section-kicker span {
    margin: 0 5px;
    color: #d39f4a;
}

h2 {
    margin: 0;
    color: #254b40;
    font-size: 22px;
    font-weight: 680;
    line-height: 1.35;
}

.hand-note {
    padding-bottom: 3px;
    color: #9a9e79;
    font-size: 12px;
    white-space: nowrap;
}

.hand-note span {
    margin-left: 3px;
    color: #e17861;
    font-size: 16px;
}

.compose-form {
    display: flex;
    flex-direction: column;
}

.field-label {
    color: #436357;
    font-size: 12px;
    font-weight: 700;
}

.field-label > span {
    margin-left: 7px;
    color: #a2afa7;
    font-size: 11px;
    font-weight: 450;
}

.recipient-field {
    height: 48px;
    margin-top: 10px;
    margin-bottom: 25px;
    padding: 0 13px;
    display: flex;
    align-items: center;
    gap: 9px;
    border: 1px solid #dce8df;
    border-radius: 5px;
    background: #fbfdfb;
    transition: border-color 140ms ease, box-shadow 140ms ease;
}

.recipient-field:focus-within,
.message-input:focus {
    border-color: #89ae99;
    outline: none;
    box-shadow: 0 0 0 3px rgb(104 157 125 / 10%);
}

.at-mark {
    color: #d7984a;
    font-size: 17px;
    font-weight: 650;
}

.field-hint-error {
    margin: -17px 0 18px;
    color: #c66b56;
    font-size: 11px;
    line-height: 1.5;
}

.recipient-field input {
    width: 100%;
    height: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #234b3e;
    font-size: 13px;
}

.recipient-field input::placeholder,
.message-input::placeholder {
    color: #abb8b0;
}

.message-label-row {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.character-count {
    color: #687f73;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.character-count span {
    color: #a4b0a9;
}

.count-near-limit {
    color: #ce6e54;
}

.message-input {
    width: 100%;
    min-height: 150px;
    padding: 13px 15px;
    resize: vertical;
    border: 1px solid #dce8df;
    border-radius: 5px;
    background: #fbfdfb;
    color: #234b3e;
    font-size: 14px;
    line-height: 1.75;
    transition: border-color 140ms ease, box-shadow 140ms ease;
}

.form-bottom {
    margin-top: 19px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.anonymous-toggle {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.anonymous-toggle input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
}

.toggle-track {
    width: 34px;
    height: 20px;
    flex: 0 0 34px;
    padding: 3px;
    display: flex;
    align-items: center;
    border-radius: 12px;
    background: #d9e4dc;
    transition: background 160ms ease;
}

.toggle-track span {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgb(37 65 52 / 18%);
    transition: transform 160ms ease;
}

.anonymous-toggle input:checked + .toggle-track {
    background: #548b6e;
}

.anonymous-toggle input:checked + .toggle-track span {
    transform: translateX(14px);
}

.anonymous-toggle input:focus-visible + .toggle-track {
    outline: 3px solid rgb(84 139 110 / 25%);
    outline-offset: 2px;
}

.toggle-copy {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.toggle-copy strong {
    color: #456356;
    font-size: 11px;
    font-weight: 700;
}

.toggle-copy small {
    color: #9ca9a1;
    font-size: 10px;
}

.send-button {
    min-height: 43px;
    padding: 0 14px 0 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    border: 0;
    border-radius: 5px;
    background: #285f4e;
    color: #fffdf7;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    transition: background 140ms ease, transform 140ms ease;
}

.send-button:hover:not(:disabled) {
    transform: translateY(-1px);
    background: #1d4d3e;
}

.send-button:disabled {
    cursor: not-allowed;
    opacity: 0.47;
}

.send-arrow {
    color: #f4cf77;
    font-size: 17px;
    line-height: 1;
}

.form-footnote {
    margin: 13px 0 0;
    color: #98a89e;
    font-size: 10px;
    line-height: 1.6;
}

@media (max-width: 560px) {
    h2 {
        font-size: 19px;
    }

    .section-heading {
        margin-bottom: 23px;
    }

    .section-kicker {
        font-size: 9px;
    }

    .hand-note {
        font-size: 10px;
    }

    .recipient-field {
        margin-bottom: 22px;
    }

    .message-input {
        min-height: 138px;
    }

    .form-bottom {
        align-items: flex-end;
        gap: 9px;
    }

    .send-button {
        min-height: 41px;
        padding: 0 11px 0 13px;
        gap: 9px;
        font-size: 11px;
    }
}
</style>
