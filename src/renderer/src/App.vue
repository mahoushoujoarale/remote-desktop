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
const remotePeerId = ref('23423423');
const showWindow = ref(false);
const toggleWindowState: () => void = () => {
  showWindow.value = !showWindow.value;
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <Home v-if="!showWindow" @toggleWindowState="toggleWindowState" />
        <RemoteWindow
          v-else
          :peerId="peerId"
          :remotePeerId="remotePeerId"
          :startTime="Date.now()"
          @toggleWindowState="toggleWindowState"
        />
      </el-main>
      <el-footer>
        <el-text class="mx-1">powered by zhaojie</el-text>
      </el-footer>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.common-layout {
  height: 100vh;
  display: flex;
  align-items: center;
}
.el-container {
  height: 100%;
}
.el-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
