<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Home from './components/Home/index.vue';
import RemoteWindow from './components/RemoteWindow/index.vue';
import LevitatingBall from './components/LevitatingBall/index.vue';
import { MediaConnection } from 'peerjs';
import { socket, peer } from './util';
import { IMouseClickData, IKeyDownData, IScrollData } from './components/RemoteWindow/type';
import { ConnectionType } from './type';

// 这俩是用来远程连接的id
const userId = ref(`${Math.floor(Math.random() * 899999) + 100000}`);
const remoteId = ref('');
// 这是peer用到的id
const peerId = ref('');
const showWindow = ref(false);
const call = ref<MediaConnection>();
const videoSrcObject = ref();
const startTime = ref(Date.now());
const connectionType = ref(ConnectionType.NotConnected);

const handleConnect = (id: string) => {
  remoteId.value = id;
  socket.emit('remoteconnect', {
    userInfo: {
      userId: userId.value,
      peerId: peerId.value,
    }, remoteId: remoteId.value
  });
};
const handleDisconnect = (isReceived = false) => {
  if (!isReceived) {
    socket.emit('remotedisconnected', remoteId.value);
  }
  showWindow.value = false;
  connectionType.value = ConnectionType.NotConnected;
  remoteId.value = '';
};
const handleMouseClick = (data: IMouseClickData) => {
  socket.emit('mouseclick', { remoteId: remoteId.value, data });
};
const handleScroll = (data: IScrollData) => {
  socket.emit("scroll", { remoteId: remoteId.value, data });
};
const handleKeyDown = (data: IKeyDownData) => {
  socket.emit('keydown', { remoteId: remoteId.value, data });
};

onMounted(() => {
  peer.on("open", (id) => {
    peerId.value = id;
    // 在没触发这个事件之前需要加loading
  });
  peer.on("call", async (call) => {
    call.answer();
    call.on('stream', (stream) => {
      videoSrcObject.value = stream;
      startTime.value = Date.now();
      connectionType.value = ConnectionType.Controller;
      showWindow.value = true;
      socket.emit('remoteconnected', { remoteId: remoteId.value, startTime: startTime.value });
    });
  });

  socket.on('connect', () => {
    socket.emit('join', userId.value);
  });
  socket.on("connect_error", (e) => {
    console.log("Socket connection error, retrying..." + e);
    setTimeout(() => socket.connect(), 5000);
  });
  socket.on('remoteconnect', async (remoteInfo) => {
    const stream = await window.api.getMediaStream();
    if (stream) {
      call.value = peer.call(remoteInfo.peerId, stream);
      remoteId.value = remoteInfo.userId;
    } else {
      socket.emit('remoteconnect_error', remoteInfo.userId);
    }
  });
  socket.on('remoteconnect_error', () => {
    // todo: 处理error
  });
  socket.on('remoteconnected', (remoteStartTime: number) => {
    startTime.value = remoteStartTime;
    connectionType.value = ConnectionType.Client;
  });
  socket.on('remotedisconnected', () => {
    handleDisconnect(true);
    if (call.value) {
      call.value.close();
    }
  });
  socket.on('mouseclick', (data: IMouseClickData) => {
    window.api.doMouseClick(data);
  });
  socket.on('scroll', (data: IScrollData) => {
    window.api.doScroll(data);
  });
  socket.on('keydown', (data: IKeyDownData) => {
    window.api.doKeyDown(data);
  });
})
</script>

<template>
  <div class="common-layout">
    <Home
      v-if="!showWindow"
      :userId="userId"
      @handleConnect="handleConnect"
    />
    <RemoteWindow
      v-else
      :videoSrcObject="videoSrcObject"
      @handleDisconnect="handleDisconnect"
      @handleMouseClick="handleMouseClick"
      @hadnleScroll="handleScroll"
      @handleKeyDown="handleKeyDown"
    />
    <LevitatingBall
      v-if="connectionType !== ConnectionType.NotConnected"
      :userId="userId"
      :remoteId="remoteId"
      :startTime="startTime"
      :connectionType="connectionType"
      @handleDisconnect="handleDisconnect"
    />
  </div>
</template>

<style lang="less" scoped>
.common-layout {
  height: 100vh;
}
</style>
