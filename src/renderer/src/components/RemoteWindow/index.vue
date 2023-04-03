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

const video = ref<HTMLVideoElement>();
const videoLoading = ref(true);

const cancelLoading = () => {
  videoLoading.value = false;
};
const handleMouseClick = (event: MouseEvent) => {
  const data = getMouseClickData(event);
  emit('handleMouseClick', data);
};
const handleScroll = (event: WheelEvent) => {
  const data = getScrollData(event);
  emit('handleScroll', data);
};
const handleKeyDown = (event: KeyboardEvent) => {
  const data = getKeyDownData(event);
  emit('handleKeyDown', data);
};

onMounted(() => {
  video.value?.addEventListener('canplaythrough', cancelLoading, { once: true });
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
    <div v-loading="videoLoading" element-loading-background="#2f3241" class="remote-window">
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
