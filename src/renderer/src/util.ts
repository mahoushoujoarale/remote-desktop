import Peer from "peerjs";
import io from 'socket.io-client';

// todo: 这里有问题，这两个应该在app的mouted里边初始化
export const socket = io('http://192.168.1.11:8010');
export const peer = new Peer();
