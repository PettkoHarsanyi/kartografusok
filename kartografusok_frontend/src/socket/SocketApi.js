import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client"
import { initRoom } from "../state/room/actions";
import { getState } from "../state/selector";

class SocketApi {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io("http://localhost:3030");
  }

  sendMessage(message) {
    this.socket.emit("create", "messages", message);
  }

  createRoom(leader, ack) {
    this.socket.emit("create-room", ack);
  }

  syncAction(roomId,action,broadcast){
    this.socket.emit(
      "sync-action",
      roomId,
      action,
      broadcast,
      (ack) => {}
    );
  }

  syncState(roomId,state,broadcast,ack){
    this.socket.emit(
      "sync-state",
      roomId,
      state,
      broadcast,
      ack
    );
  }

  leaveRoom(roomId,ack){
    this.socket.emit(
      "leave-room",
      roomId,
      ack
    );
  }

  closeRoom(roomId,ack){
    this.socket.emit(
      "close-room",
      roomId,
      ack
    );
  }

  joinRoom(id,user,ack) {
    this.socket.emit("join-room", id, user, ack);
  }

  onPlayerLeft(callback){
    const listener = (message) => {
      callback(message);
    }
    this.socket.on("player-left",listener);
    return () => this.socket.off("player-left",listener);
  }

  onMessageReceived(callback) {
    const listener = (message) => {
      callback(message);
    };
    this.socket.on("messages created", listener);
    return () => this.socket.off("messages created", listener);
  }

  onPlayerJoined(callback) {
    const listener = (action) => {
      callback(action);
    };
    this.socket.on("player-joined", listener);
    return () => this.socket.off("player-joined", listener);
  }

  onStateChanged(callback) {
    const listener = (action) => {
      callback(action);
    };
    this.socket.on("state-changed", listener);
    return () => this.socket.off("state-changed", listener);
  }

  onActionSent(callback) {
    const listener = (action) => {
      callback(action);
    };
    this.socket.on("action-sent", listener);
    return () => this.socket.off("action-sent", listener);
  }

  onGameStart(callback){
    const listener = (action) => {
      callback(action);
    };
    this.socket.on("game-start", listener);
    return () => this.socket.off("game-start", listener);
  }

  get id() {
    return this.socket?.id;
  }

}
export const socketApi = new SocketApi();
