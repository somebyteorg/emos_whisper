<script lang="ts" setup>
import ComposeForm from '@/components/ComposeForm.vue'
import IntroPanel from '@/components/IntroPanel.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import WhisperListPanel from '@/components/WhisperListPanel.vue'
import WhisperTabs from '@/components/WhisperTabs.vue'
import {useWhispers} from '@/composables/useWhispers'
import type {Whisper} from '@/types/whisper'

const {
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
    username,
    signIn,
    signOut,
    refreshActiveList,
    replyToWhisper,
    sending,
} = useWhispers()

function updateReplyDraft(whisperId: number, value: string) {
    replyDrafts[whisperId] = value
}

function handleReply(whisper: Whisper) {
    void replyToWhisper(whisper)
}
</script>

<template>
    <main :class="{ 'list-view': activeTab !== 'write' }" class="whisper-page">
        <SiteHeader
            :avatar="avatar"
            :loading="profileLoading"
            :signed-in="isSignedIn"
            :username="username"
            @home="selectTab('write')"
            @sign-in="signIn"
            @sign-out="signOut"
        />

        <div class="page-shell">
            <IntroPanel/>

            <section aria-label="悄悄话" class="workspace">
                <WhisperTabs
                    v-if="isSignedIn"
                    :model-value="activeTab"
                    :received-count="receivedWhispers.length"
                    :sent-count="sentWhispers.length"
                    @update:model-value="selectTab"
                />

                <ComposeForm
                    v-if="activeTab === 'write'"
                    :draft="draft"
                    :sending="sending"
                    :signed-in="isSignedIn"
                    @send="sendWhisper"
                />
                <WhisperListPanel
                    v-else
                    :loaded="activeTab === 'received' ? receivedLoaded : sentLoaded"
                    :loading="activeListLoading"
                    :reply-drafts="replyDrafts"
                    :replying-to="replyingTo"
                    :tab="activeTab"
                    :whispers="activeWhispers"
                    @refresh="refreshActiveList"
                    @reply="handleReply"
                    @write="selectTab('write')"
                    @update:reply-draft="updateReplyDraft"
                />

                <p v-if="notice" :class="`notice-${noticeType}`" aria-live="polite" class="notice" role="status">
                    {{ notice }}
                    <button aria-label="关闭提示" type="button" @click="clearNotice">×</button>
                </p>
            </section>
        </div>

        <footer class="page-footer"><span>emos · whisper</span><span>轻轻说，认真听 <i>✳</i></span></footer>
    </main>
</template>

<style scoped>
:global(*) {
    box-sizing: border-box;
}

:global(body) {
    margin: 0;
    background: #f5f9f6;
    color: #183d35;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    -webkit-font-smoothing: antialiased;
}

:global(button),
:global(input),
:global(textarea),
:global(select) {
    font: inherit;
}

.whisper-page {
    min-height: 100vh;
    overflow: hidden;
    background: #f5f9f6;
    color: #183d35;
}

.whisper-page.list-view {
    width: 100%;
    height: 100vh;
    height: 100dvh;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.page-shell {
    width: min(100%, 1320px);
    margin: 0 auto;
    padding: 88px 48px 96px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(460px, 0.96fr);
    gap: 76px;
    align-items: start;
}

.list-view .page-shell {
    flex: 1 1 auto;
    min-height: 0;
    grid-template-rows: minmax(0, 1fr);
    align-items: stretch;
    padding-top: 88px;
    padding-bottom: clamp(24px, 4vh, 50px);
}

.list-view .page-shell :deep(.intro) {
    align-self: start;
    min-height: min(570px, calc(100dvh - 92px - 59px - 88px - clamp(24px, 4vh, 50px)));
}

.workspace {
    min-width: 0;
    padding-left: 48px;
    border-left: 1px solid #dce8df;
}

.list-view .workspace {
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.list-view .workspace :deep(.workspace-tabs) {
    flex: 0 0 auto;
}

.list-view .workspace :deep(.list-panel) {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
}

.list-view .workspace :deep(.list-state) {
    flex: 1 1 auto;
}

.list-view .workspace :deep(.list-content) {
    flex: 1 1 auto;
}

.notice {
    position: relative;
    margin: 20px 0 0;
    padding: 10px 34px 10px 12px;
    border-left: 2px solid #5b9b74;
    background: #eaf3eb;
    color: #446e53;
    font-size: 12px;
    line-height: 1.55;
}

.notice-error {
    border-left-color: #d86e58;
    background: #fbefeb;
    color: #a94e41;
}

.notice button {
    position: absolute;
    top: 50%;
    right: 8px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
}

.notice button:hover {
    background: rgb(255 255 255 / 50%);
}

.page-footer {
    width: min(100% - 96px, 1224px);
    min-height: 59px;
    margin: 0 auto;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #e0e9e2;
    color: #a0ada5;
    font-size: 10px;
}

.page-footer i {
    margin-left: 3px;
    color: #e3b353;
    font-size: 13px;
    font-style: normal;
}

@media (max-width: 1080px) {
    .page-shell {
        grid-template-columns: minmax(0, 1fr) minmax(390px, 0.95fr);
        gap: 45px;
        padding-right: 36px;
        padding-left: 36px;
    }

    .workspace {
        padding-left: 33px;
    }
}

@media (max-width: 820px) {
    .whisper-page.list-view {
        width: auto;
        height: auto;
        min-height: 100vh;
        min-height: 100svh;
        overflow: visible;
    }

    .page-shell,
    .list-view .page-shell {
        flex: initial;
        min-height: auto;
        max-width: 680px;
        padding: 55px 27px 67px;
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        gap: 49px;
    }

    .list-view .page-shell :deep(.intro) {
        align-self: auto;
        min-height: 0;
    }

    .workspace,
    .list-view .workspace {
        display: block;
        min-height: auto;
        padding: 29px 0 0;
        border-top: 1px solid #dce8df;
        border-left: 0;
    }

    .list-view .workspace :deep(.list-panel) {
        display: block;
        min-height: auto;
    }

    .list-view .workspace :deep(.list-state) {
        min-height: 190px;
    }

    .list-view .workspace :deep(.list-content) {
        display: block;
    }

    .page-footer {
        width: calc(100% - 54px);
    }
}

@media (max-width: 560px) {
    .page-shell,
    .list-view .page-shell {
        padding: 44px 20px 54px;
        gap: 38px;
    }

    .workspace,
    .list-view .workspace {
        padding-top: 22px;
    }

    .page-footer {
        width: calc(100% - 40px);
        min-height: 53px;
        font-size: 9px;
    }
}

@media (prefers-reduced-motion: reduce) {
    :global(*),
    :global(*::before),
    :global(*::after) {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
    }
}
</style>
