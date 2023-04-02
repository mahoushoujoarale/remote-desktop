<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getMouseClickData, getScrollData, getKeyDownData } from './util';
import { IKeyDownData, IScrollData, IMouseClickData } from './type';

defineProps<{
  videoSrcObject: object;
}>();
const emit = defineEmits<{
  (e: 'handleMouseClick', data: IMouseClickData): void;
  (e: 'handleScroll', data: IScrollData): void;
  (e: 'handleKeyDown', data: IKeyDownData): void;
}>();

const video = ref();

const handleMouseClick = (event) => {
  const data = getMouseClickData(event);
  emit('handleMouseClick',data);
};
const handleScroll = (event) => {
  const data = getScrollData(event);
  emit('handleScroll', data);
}
const handleKeyDown = (event) => {
  const data = getKeyDownData(event);
  emit('handleKeyDown', data);
};

onMounted(() => {
  video.value?.addEventListener('click', handleMouseClick);
  document.addEventListener('wheel', handleScroll);
  document.addEventListener('keydown', handleKeyDown);
});
onBeforeUnmount(() => {
  video.value?.removeEventListener('click', handleMouseClick);
  document.removeEventListener('wheel', handleScroll);
  document.removeEventListener('keydown', handleKeyDown);
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
