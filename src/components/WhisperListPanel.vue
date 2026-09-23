<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import type {Whisper, WhisperTab} from '@/types/whisper'
import WhisperEntry from '@/components/WhisperEntry.vue'

type ReplyFilter = 'all' | 'pending' | 'replied'

const props = defineProps<{
    tab: Exclude<WhisperTab, 'write'>
    whispers: Whisper[]
    loading: boolean
    loaded: boolean
    replyingTo: number | null
    replyDrafts: Record<number, string>
}>()

const emit = defineEmits<{
    refresh: []
    write: []
    reply: [whisper: Whisper]
    'update:replyDraft': [whisperId: number, value: string]
}>()

const search = ref('')
const replyFilter = ref<ReplyFilter>('all')
const heading = computed(() => props.tab === 'received' ? '收到的悄悄话' : '我说过的话')
const eyebrow = computed(() => props.tab === 'received' ? '落在你手里的话' : '你寄出的心意')
const filteredWhispers = computed(() => {
    const query = search.value.trim().toLocaleLowerCase()

    return props.whispers.filter((whisper) => {
        const hasReply = Boolean(whisper.receiver_content || whisper.receiver_at)
        const otherPerson = props.tab === 'received'
            ? whisper.sender_user?.username || '匿名'
            : whisper.receiver_user?.username || whisper.receiver_user?.id || ''
        const text = `${otherPerson} ${whisper.sender_content} ${whisper.receiver_content ?? ''}`.toLocaleLowerCase()
        const matchesSearch = !query || text.includes(query)
        const matchesStatus = replyFilter.value === 'all'
            || (replyFilter.value === 'replied' ? hasReply : !hasReply)

        return matchesSearch && matchesStatus
    })
})

watch(() => props.tab, () => {
    search.value = ''
    replyFilter.value = 'all'
})
</script>

<template>
    <section :aria-labelledby="`${tab}-title`" class="list-panel">
        <div class="section-heading list-heading">
            <div>
                <p class="section-kicker"><span>{{ tab === 'received' ? '02' : '03' }}</span> {{ eyebrow }}</p>
                <h2 :id="`${tab}-title`">{{ heading }}</h2>
            </div>
            <button :disabled="loading" aria-label="重新加载悄悄话" class="refresh-button" title="重新看看" type="button" @click="emit('refresh')">↻</button>
        </div>

        <div v-if="loading && !loaded" class="list-state" role="status">正在把信找出来…</div>
        <div v-else-if="!loaded" class="list-state error-state" role="status">
            <p>这次没能把信找出来。</p>
            <button class="text-action" type="button" @click="emit('refresh')">再找一次</button>
        </div>
        <div v-else-if="!whispers.length" class="list-state empty-state">
            <span aria-hidden="true" class="empty-mark">✳</span>
            <p>{{ tab === 'received' ? '这里还很安静。' : '还没有寄出第一句话。' }}</p>
            <button v-if="tab === 'sent'" class="text-action" type="button" @click="emit('write')">去写一句 <span aria-hidden="true">↗</span></button>
        </div>
        <div v-else class="list-content">
            <div class="list-filters">
                <label class="search-control">
                    <span aria-hidden="true" class="search-icon"></span>
                    <span class="visually-hidden">搜索悄悄话</span>
                    <input v-model="search" autocomplete="off" placeholder="搜内容或对方" type="search"/>
                </label>
                <label class="status-control">
                    <span class="visually-hidden">按回复状态筛选</span>
                    <select v-model="replyFilter">
                        <option value="all">全部状态</option>
                        <option value="pending">{{ tab === 'received' ? '等你回复' : '等 TA 回复' }}</option>
                        <option value="replied">已回复</option>
                    </select>
                </label>
            </div>

            <div v-if="!filteredWhispers.length" class="list-state filtered-empty" role="status">
                <span>没找到这句悄悄话。</span>
                <button class="text-action" type="button" @click="search = ''; replyFilter = 'all'">清空筛选</button>
            </div>
            <div v-else class="whisper-list">
                <WhisperEntry
                    v-for="whisper in filteredWhispers"
                    :key="whisper.whisper_id"
                    :reply-draft="replyDrafts[whisper.whisper_id] ?? ''"
                    :replying="replyingTo === whisper.whisper_id"
                    :tab="tab"
                    :whisper="whisper"
                    @reply="emit('reply', whisper)"
                    @update:reply-draft="emit('update:replyDraft', whisper.whisper_id, $event)"
                />
            </div>
        </div>

        <p v-if="loading && loaded" class="inline-loading" role="status">正在更新…</p>
    </section>
</template>

<style scoped>
.section-heading {
    margin-bottom: 20px;
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
    margin-right: 6px;
    color: #d39f4a;
}

h2 {
    margin: 0;
    color: #254b40;
    font-size: 22px;
    font-weight: 680;
    line-height: 1.35;
}

.refresh-button {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border: 1px solid #dce8df;
    border-radius: 5px;
    background: #fbfdfb;
    color: #6d8c7b;
    cursor: pointer;
    font-size: 21px;
    line-height: 1;
    transition: transform 160ms ease, border-color 160ms ease;
}

.refresh-button:hover:not(:disabled) {
    transform: rotate(35deg);
    border-color: #91b29e;
}

.refresh-button:disabled {
    cursor: wait;
    opacity: 0.5;
}

.list-panel {
    min-width: 0;
}

.list-content {
    display: flex;
    min-height: 0;
    flex: 1 1 auto;
    flex-direction: column;
}

.list-filters {
    min-height: 39px;
    flex: 0 0 auto;
    margin-bottom: 7px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 132px;
    gap: 8px;
}

.search-control,
.status-control {
    height: 39px;
    min-width: 0;
    display: flex;
    align-items: center;
    border: 1px solid #dce8df;
    border-radius: 5px;
    background: #fbfdfb;
}

.search-control {
    padding: 0 11px;
    gap: 9px;
}

.search-control:focus-within,
.status-control:focus-within {
    border-color: #89ae99;
    box-shadow: 0 0 0 3px rgb(104 157 125 / 10%);
}

.search-icon {
    position: relative;
    width: 13px;
    height: 13px;
    flex: 0 0 13px;
    border: 1.5px solid #87a092;
    border-radius: 50%;
}

.search-icon::after {
    position: absolute;
    right: -4px;
    bottom: -2px;
    width: 5px;
    height: 1.5px;
    transform: rotate(45deg);
    border-radius: 2px;
    background: #87a092;
    content: "";
}

.search-control input {
    width: 100%;
    min-width: 0;
    height: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #234b3e;
    font: inherit;
    font-size: 12px;
}

.search-control input::placeholder {
    color: #abb8b0;
}

.status-control {
    position: relative;
    padding: 0;
    border-color: #d6e4d9;
    background: #f1f7f1;
    transition: border-color 140ms ease, background 140ms ease, box-shadow 140ms ease;
}

.status-control:hover {
    border-color: #abc4b2;
    background: #edf5ee;
}

.status-control::after {
    position: absolute;
    top: 14px;
    right: 12px;
    width: 7px;
    height: 7px;
    transform: rotate(45deg);
    border-right: 1.5px solid #6f8d7b;
    border-bottom: 1.5px solid #6f8d7b;
    content: "";
    pointer-events: none;
}

.status-control select {
    width: 100%;
    height: 100%;
    padding: 0 30px 0 11px;
    border: 0;
    outline: 0;
    appearance: none;
    background: transparent;
    color: #456a56;
    cursor: pointer;
    font: inherit;
    font-size: 11px;
    font-weight: 650;
}

.status-control select option {
    background: #fbfdfb;
    color: #315d51;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
    border: 0;
}

.list-state {
    min-height: 224px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #91a299;
    font-size: 13px;
}

.empty-state,
.filtered-empty,
.error-state {
    flex-direction: column;
    gap: 7px;
}

.empty-state p,
.error-state p {
    margin: 7px 0 0;
}

.empty-mark {
    color: #e5b85e;
    font-size: 24px;
}

.text-action {
    margin-top: 5px;
    padding: 6px;
    border: 0;
    background: transparent;
    color: #4c8068;
    cursor: pointer;
    font: inherit;
    font-size: 12px;
    font-weight: 650;
}

.text-action span {
    margin-left: 3px;
    color: #e17861;
}

.whisper-list {
    min-width: 0;
    min-height: 0;
    flex: 1 1 auto;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-color: #cbdcd0 transparent;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
}

.inline-loading {
    margin: 8px 0 0;
    color: #9ba99f;
    font-size: 11px;
}

@media (max-width: 820px) {
    .whisper-list {
        overflow: visible;
        scrollbar-gutter: auto;
    }
}

@media (max-width: 560px) {
    .list-filters {
        grid-template-columns: minmax(0, 1fr) 118px;
        gap: 7px;
    }

    h2 {
        font-size: 19px;
    }

    .section-heading {
        margin-bottom: 23px;
    }

    .section-kicker {
        font-size: 9px;
    }

    .list-state {
        min-height: 190px;
    }
}
</style>
