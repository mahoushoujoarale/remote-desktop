<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  peerId: string;
}>();
const emit = defineEmits<{
  (e: 'handleConnect', remotePeerId: string): void;
}>();

const remotePeerId = ref('');

const handleConnect = () => {
  window.api.handleConnect();
  emit('handleConnect', remotePeerId.value);
};
</script>

<template>
  <el-container>
    <el-main>
      <el-text class="mx-1">你的连接ID：{{ peerId }}</el-text>
      <el-input v-model="remotePeerId" placeholder="请输入受控端ID" @keyup.enter="handleConnect" />
    </el-main>
    <el-footer>
      <el-text class="mx-1">powered by zhaojie</el-text>
    </el-footer>
  </el-container>
</template>

<style lang="less" scoped>
.el-container {
  height: 100%;
  background-image: url(../../assets/backgroundImage.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.el-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .el-text {
    color: #f3f3f3;
    font-size: 24px;
    margin-bottom: 20px;
  }
}
.el-footer {
  display: flex;
  justify-content: center;
  align-items: center;
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
