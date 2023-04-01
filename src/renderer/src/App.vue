<script setup lang="ts">
import { ref } from 'vue';
import Home from './components/Home/index.vue';
import RemoteWindow from './components/RemoteWindow/index.vue';

enum IConnectionType {
  NotConnected,
  Controlled,
  BeingControlled,
}

const peerId = ref('34234');
const remotePeerId = ref();
const showWindow = ref(false);

const toggleWindowState = (remoteId?: string) => {
  if (remoteId != undefined) {
    remotePeerId.value = remoteId;
  }
  showWindow.value = !showWindow.value;
};
</script>

<template>
  <div class="common-layout">
    <Home
      v-if="!showWindow"
      :peerId="peerId"
      @handleConnect="toggleWindowState"
    />
    <RemoteWindow
      v-else
      :peerId="peerId"
      :remotePeerId="remotePeerId"
      :startTime="Date.now()"
      @toggleWindowState="toggleWindowState"
    />
  </div>
</template>

<style lang="less" scoped>
.common-layout {
  height: 100vh;
}
</style>
