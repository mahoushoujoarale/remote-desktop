<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Home from './components/Home/index.vue';
import RemoteWindow from './components/RemoteWindow/index.vue';
import LevitatingBall from './components/LevitatingBall/index.vue';
import Peer, { MediaConnection } from 'peerjs';
import { IMouseData, IKeyData, IScrollData } from './components/RemoteWindow/type';
import { ConnectionType } from './type';
import { io } from 'socket.io-client';
import { ElMessage } from 'element-plus';
import { peerOption, serverUrl } from './constant';

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
const shouldLoading = ref(false);
const isConnectted = computed(() => connectionType.value !== ConnectionType.NotConnected);
const isTimeout = ref(false);
const peer = new Peer(peerOption);
const socket = io(serverUrl);

peer.on('open', id => {
  peerId.value = id;
  console.log('peer init');
});
peer.on('error', e => {
  console.log('Peer Init error, retrying...' + e);
  setTimeout(() => {
    peer.reconnect();
  }, 500);
});
socket.on('connect', () => {
  socket.emit('join', userId.value);
});
socket.on('connect_error', e => {
  console.log('Socket connection error, retrying...' + e);
  setTimeout(() => socket.connect(), 5000);
});

const handleConnect = (id: string) => {
  if (peerId.value === '') {
    ElMessage.closeAll();
    ElMessage.warning('服务暂不可用，请稍等');
    return;
  }
  remoteId.value = id;
  shouldLoading.value = true;
  isTimeout.value = false;
  // 控制端发送控制请求
  socket.emit('remoteconnect', {
    userInfo: {
      userId: userId.value,
      peerId: peerId.value,
    },
    remoteId: remoteId.value,
  });
  setTimeout(() => {
    if (connectionType.value === ConnectionType.NotConnected) {
      shouldLoading.value = false;
      isTimeout.value = true;
      ElMessage.closeAll();
      ElMessage.error('连接超时，请稍后重试');
      // 控制端告知傀儡端超时
      socket.emit('remotetimeout', remoteId.value);
    }
  }, 5000);
};
const handleDisconnect = (isReceived = false) => {
  if (!isReceived) {
    // 通知另一方断开连接
    socket.emit('remotedisconnected', remoteId.value);
  }
  showWindow.value = false;
  connectionType.value = ConnectionType.NotConnected;
  remoteId.value = '';
};
const handleMouse = (data: IMouseData) => {
  socket.emit('mouse', { remoteId: remoteId.value, data });
};
const handleScroll = (data: IScrollData) => {
  socket.emit('scroll', { remoteId: remoteId.value, data });
};
const handleKey = (data: IKeyData) => {
  socket.emit('key', { remoteId: remoteId.value, data });
};
const releaseResource = () => {
  socket.close();
  peer.destroy();
};

onMounted(() => {
  // 控制端接收到傀儡端传来的stream
  peer.on('call', async call => {
    if (isTimeout.value) return;
    call.answer();
    call.on('stream', stream => {
      videoSrcObject.value = stream;
      startTime.value = Date.now();
      connectionType.value = ConnectionType.Controller;
      shouldLoading.value = false;
      showWindow.value = true;
      // 控制端告知傀儡端已连接
      socket.emit('remoteconnected', { remoteId: remoteId.value, startTime: startTime.value });
    });
  });

  // 控制端收到remoteID不存在
  socket.on('remotenotexist', () => {
    if (isTimeout.value) return;
    shouldLoading.value = false;
    ElMessage.closeAll();
    ElMessage.error('远程ID不存在');
  });
  // 傀儡端收到控制请求
  socket.on('remoteconnect', async remoteInfo => {
    if (isTimeout.value) return;
    if (isConnectted.value) {
      // 傀儡端告知控制端自己已被连接
      socket.emit('remoteisconnected', remoteInfo.userId);
      return;
    }
    const stream = await window.api.getMediaStream();
    if (stream) {
      call.value = peer.call(remoteInfo.peerId, stream);
      remoteId.value = remoteInfo.userId;
    } else {
      // 傀儡端告知控制端连接失败
      socket.emit('remoteconnect_error', remoteInfo.userId);
    }
  });
  // 控制端收到傀儡端已被控制的消息
  socket.on('remoteisconnected', () => {
    if (isTimeout.value) return;
    shouldLoading.value = false;
    ElMessage.closeAll();
    ElMessage.warning('远程机已被其它机器控制');
  });
  // 控制端收到连接错误的消息
  socket.on('remoteconnect_error', () => {
    if (isTimeout.value) return;
    shouldLoading.value = false;
    ElMessage.closeAll();
    ElMessage.error('连接异常，请稍后重试');
  });
  // 傀儡端收到控制端超时消息
  socket.on('remotetimeout', () => {
    isTimeout.value = true;
  });
  // 傀儡端收到控制端已连接消息
  socket.on('remoteconnected', (remoteStartTime: number) => {
    if (isTimeout.value) return;
    startTime.value = remoteStartTime;
    connectionType.value = ConnectionType.Client;
  });
  // 接收到另一端发来的断开连接通知
  socket.on('remotedisconnected', () => {
    handleDisconnect(true);
    if (call.value) {
      call.value.close();
    }
  });
  // 傀儡端收到控制指令
  socket.on('mouse', (data: IMouseData) => {
    window.api.doMouse(data);
  });
  socket.on('scroll', (data: IScrollData) => {
    window.api.doScroll(data);
  });
  socket.on('key', (data: IKeyData) => {
    window.api.doKey(data);
  });

  window.addEventListener('beforeunload', releaseResource);
});

onBeforeUnmount(() => {
  releaseResource();
});
</script>

<template>
  <div
    v-loading="shouldLoading"
    element-loading-background="rgba(122, 122, 122, 0.8)"
    element-loading-text="连接中"
    class="common-layout"
  >
    <Home v-if="!showWindow" :userId="userId" @handleConnect="handleConnect" />
    <RemoteWindow
      v-else
      :videoSrcObject="videoSrcObject"
      @handleDisconnect="handleDisconnect"
      @handleMouse="handleMouse"
      @hadnleScroll="handleScroll"
      @handleKey="handleKey"
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

:deep(.el-loading-spinner .path) {
  stroke: azure;
}

:deep(.el-loading-spinner .el-loading-text) {
  color: azure;
}
</style>
