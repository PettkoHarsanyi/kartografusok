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

  syncAction(roomId,payload,broadcast){
    this.socket.emit(
      "sync-action",
      roomId,
      payload,
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

  joinRoom(id,ack) {
    this.socket.emit("join-room", id, ack);
  }

  onMessageReceived(callback) {
    const listener = (message) => {
      callback(message);
    };
    this.socket.on("messages created", listener);
    return () => this.socket.off("messages created", listener);
  }

  get id() {
    return this.socket?.id;
  }

}
export const socketApi = new SocketApi();
