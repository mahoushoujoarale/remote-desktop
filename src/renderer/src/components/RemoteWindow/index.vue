<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { handleKey, handleMouseClick } from './util';

defineProps<{
  videoSrcObject: object;
}>();

const video = ref();

onMounted(() => {
  video.value?.addEventListener('click', handleMouseClick);
  window.addEventListener('keydown', handleKey);
});
onBeforeUnmount(() => {
  video.value?.removeEventListener('click', handleMouseClick);
  window.removeEventListener('keydown', handleKey);
});
</script>

<template>
  <div class="container">
    <div class="remote-window">
      <video id="remote-video" ref="video" :srcObject="videoSrcObject" autoplay></video>
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
  background-color: #2f3241;
}

.remote-window {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#remote-video {
  width: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
