<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'toggleWindowState'): void;
}>();

const peerId = ref('');
const remotePeerId = ref('');
const handleConnect: () => void = () => {
  emit('toggleWindowState');
};
</script>

<template>
  <div class="container">
    <el-text class="mx-1">你的连接ID：{{ peerId }}</el-text>
    <el-input v-model="remotePeerId" placeholder="请输入受控端ID" @keyup.enter="handleConnect" />
  </div>
</template>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-text {
  color: #f3f3f3;
  font-size: 24px;
  margin-bottom: 20px;
}
.el-input {
  max-width: 560px;
  height: 44px;
  border-radius: 50px;
  overflow: hidden;
}
:deep(.el-input__wrapper) {
  box-shadow: none;
}
:deep(.el-input__inner) {
  color: black;
  font-size: 16px;
  margin: 0 15px;
}
</style>
