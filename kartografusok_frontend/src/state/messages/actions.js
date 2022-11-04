import { socketApi } from "../../socket/SocketApi";

export const ADD_MESSAGE = "ADD_MESSAGE"
export const ADD_MESSAGE_LOCAL = "ADD_MESSAGE_LOCAL"

export const addMessage = (message) => ({
    type: ADD_MESSAGE,
    payload: message
})

export const sendMessage = (text) => (dispatch) => {
    socketApi.sendMessage({
        id: Date.now.toString(),
        text,
        emitter: socketApi.id
    })
}