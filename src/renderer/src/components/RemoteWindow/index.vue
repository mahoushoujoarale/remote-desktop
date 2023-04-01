<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Operation } from '@element-plus/icons-vue';
import { handleKey, handleMouse } from './util';

const props = defineProps<{
  peerId: string;
  remotePeerId: string;
  startTime: number;
}>();
const emit = defineEmits<{
  (e: 'toggleWindowState'): void;
}>();

const dialogVisible = ref(false);
const continueTime = ref(0);
const video = ref();
let timer: ReturnType<typeof setTimeout> | null = null;

const handleBallClick: () => void = () => {
  dialogVisible.value = true;
};
const handleDisconnect: () => void = () => {
  dialogVisible.value = false;
  window.api.handleDisconnect();
  emit('toggleWindowState');
};
const updateTimer = () => {
  continueTime.value = continueTime.value + 1000;
  timer = setTimeout(updateTimer, 1000 - (Date.now() - (props.startTime + continueTime.value)));
};

onMounted(() => {
  timer = setTimeout(updateTimer, 1000 - (Date.now() - (props.startTime + continueTime.value)));
  video.value?.addEventListener('click', handleMouse);
  window.addEventListener('keydown', handleKey);
});
onBeforeUnmount(() => {
  clearTimeout(timer!);
  video.value?.removeEventListener('click', handleMouse);
  window.removeEventListener('keydown', handleKey);
});
</script>

<template>
  <div class="container">
    <div class="levitating-ball" @click.stop.prevent="handleBallClick">
      <el-icon :size="30" color="#e3e3e3"><Operation /></el-icon>
    </div>
    <el-dialog v-model="dialogVisible" title="连接详情" width="450px" align-center>
      <div class="dialog-body">
        <el-text class="mx-1">你的连接ID：{{ peerId }}</el-text>
        <el-text class="mx-1">远程连接ID：{{ remotePeerId }}</el-text>
        <el-text class="mx-1">连接开始时间：{{ new Date(startTime).toLocaleString() }}</el-text>
        <el-text class="mx-1"
          >连接持续时长：{{
            new Date(continueTime).toLocaleTimeString(undefined, { timeZone: 'UTC' })
          }}</el-text
        >
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" round @click="handleDisconnect">断开连接</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="remote-window">
      <video id="remote-video" ref="video" src=""></video>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #2f3241;
}
.levitating-ball {
  border-radius: 20px;
  position: fixed;
  z-index: 1;
  top: 20px;
  right: 20px;
  cursor: pointer;
}
.dialog-body {
  display: flex;
  flex-direction: column;

  .el-text {
    align-self: start;
    line-height: 30px;
    margin-left: 20px;
  }
}

.remote-window {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#remote-video {
  max-width: 100%;
  max-height: 100%;
}
</style>
