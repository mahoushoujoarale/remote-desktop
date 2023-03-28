<script setup lang="ts">
import { ref } from 'vue';
const remotePeerId = ref('');
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-text class="mx-1">你的连接ID：sdfjdkljf</el-text>
        <el-input v-model="remotePeerId" placeholder="请输入受控端ID" />
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
.el-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
