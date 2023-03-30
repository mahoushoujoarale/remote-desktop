<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Operation } from '@element-plus/icons-vue';

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
const videoRef = ref(undefined);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    continueTime.value = continueTime.value + 1000;
  }, 1000);
});
onBeforeUnmount(() => {
  clearInterval(timer!);
});

const handleBallClick: () => void = () => {
  dialogVisible.value = true;
};
const handleDisconnect: () => void = () => {
  dialogVisible.value = false;
  emit('toggleWindowState');
};
</script>

<template>
  <div class="container">
    <div class="levitating-ball" @click="handleBallClick">
      <el-icon :size="30" color="#3f3f3f"><Operation /></el-icon>
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
      <video :ref="videoRef" src=""></video>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.levitating-ball {
  height: 50px;
  border-radius: 20px;
  position: absolute;
  top: 0;
  right: 0;
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
</style>
