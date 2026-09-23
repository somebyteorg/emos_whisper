<script lang="ts" setup>
  import type { WhisperTab } from '@/types/whisper'

  defineProps<{
    modelValue: WhisperTab
    receivedCount: number
    sentCount: number
  }>()

  const emit = defineEmits<{
    'update:modelValue': [tab: WhisperTab]
  }>()

  const tabs: { id: WhisperTab; label: string }[] = [
    { id: 'write', label: '写一句' },
    { id: 'received', label: '收到的' },
    { id: 'sent', label: '说过的' },
  ]
</script>

<template>
  <nav aria-label="悄悄话分类" class="workspace-tabs" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :aria-selected="modelValue === tab.id"
      :class="{ 'tab-active': modelValue === tab.id }"
      class="tab-button"
      role="tab"
      type="button"
      @click="emit('update:modelValue', tab.id)">
      {{ tab.label }}
      <span v-if="tab.id === 'received' && receivedCount" class="tab-count">{{ receivedCount }}</span>
      <span v-if="tab.id === 'sent' && sentCount" class="tab-count">{{ sentCount }}</span>
    </button>
  </nav>
</template>

<style scoped>
  .workspace-tabs {
    min-height: 43px;
    margin-bottom: 34px;
    display: flex;
    align-items: stretch;
    gap: 25px;
    border-bottom: 1px solid #dce8df;
  }

  .tab-button {
    position: relative;
    margin: 0;
    padding: 0 1px 13px;
    border: 0;
    background: transparent;
    color: #8a9a92;
    cursor: pointer;
    font-size: 13px;
    font-weight: 650;
    white-space: nowrap;
  }

  .tab-button:hover,
  .tab-active {
    color: #285d4d;
  }

  .tab-active::after {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: #e47d62;
    content: '';
  }

  .tab-count {
    margin-left: 4px;
    color: #e17861;
    font-size: 11px;
  }

  @media (max-width: 820px) {
    .workspace-tabs {
      flex: 0 0 auto;
    }
  }

  @media (max-width: 560px) {
    .workspace-tabs {
      margin-bottom: 26px;
      gap: 22px;
    }

    .tab-button {
      font-size: 12px;
    }
  }
</style>
