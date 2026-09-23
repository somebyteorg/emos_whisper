<script lang="ts" setup>
  defineProps<{
    signedIn: boolean
    username: string
    avatar: string | null
    loading: boolean
  }>()

  const emit = defineEmits<{
    home: []
    signIn: []
    signOut: []
  }>()
</script>

<template>
  <header class="site-header">
    <a aria-label="悄悄话首页" class="brand" href="/" @click.prevent="emit('home')">
      <img alt="" aria-hidden="true" class="brand-mark" src="/favicon.svg" />
      <span class="brand-name">
        悄悄话
        <span>emos · whisper</span>
      </span>
    </a>

    <div class="account-area">
      <template v-if="signedIn">
        <div :title="username" class="account-name">
          <img v-if="avatar" :src="avatar" alt="" class="account-avatar" />
          <span v-else class="account-avatar account-initial">{{ username.slice(0, 1) || '你' }}</span>
          <span class="account-label">{{ loading ? '认认你…' : username || '回来啦' }}</span>
        </div>
        <button class="quiet-button" type="button" @click="emit('signOut')">先把信收起来</button>
      </template>
      <button v-else class="login-button" type="button" @click="emit('signIn')">
        登录，去说句话
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
  .site-header {
    width: min(100%, 1320px);
    min-height: 92px;
    flex: 0 0 auto;
    margin: 0 auto;
    padding: 22px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #183d35;
    text-decoration: none;
  }

  .brand-mark {
    display: block;
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 4px 10px rgb(105 80 37 / 10%);
  }

  .brand-name {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 18px;
    font-weight: 750;
    line-height: 1.1;
  }

  .brand-name span {
    color: #81948d;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .account-area,
  .account-name {
    display: flex;
    align-items: center;
  }

  .account-area {
    gap: 19px;
  }

  .account-name {
    max-width: 190px;
    gap: 9px;
    color: #315d51;
    font-size: 13px;
    font-weight: 650;
  }

  .account-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .account-avatar {
    width: 31px;
    height: 31px;
    flex: 0 0 31px;
    border-radius: 50%;
    object-fit: cover;
  }

  .account-initial {
    display: grid;
    place-items: center;
    background: #d8e9dc;
    color: #346a57;
    font-size: 12px;
  }

  .login-button,
  .quiet-button {
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .login-button {
    padding: 10px 15px;
    border: 1px solid #d7e4db;
    border-radius: 7px;
    color: #315d51;
    font-size: 13px;
    font-weight: 700;
    transition:
      border-color 150ms ease,
      background 150ms ease;
  }

  .login-button:hover {
    border-color: #8bad9b;
    background: #edf5ef;
  }

  .login-button span {
    margin-left: 7px;
    color: #e17861;
    font-size: 15px;
  }

  .quiet-button {
    padding: 6px 0;
    color: #83948c;
    font-size: 12px;
  }

  .quiet-button:hover {
    color: #d26857;
  }

  @media (max-width: 820px) {
    .site-header {
      min-height: 78px;
      padding: 18px 27px;
    }
  }

  @media (max-width: 560px) {
    .site-header {
      min-height: 72px;
      padding: 15px 20px;
    }

    .brand-mark {
      width: 36px;
      height: 36px;
      flex-basis: 36px;
    }

    .account-area {
      gap: 10px;
    }

    .account-name {
      max-width: 100px;
    }

    .account-label {
      display: none;
    }

    .login-button {
      padding: 9px 11px;
      font-size: 12px;
    }

    .quiet-button {
      font-size: 11px;
    }
  }
</style>
