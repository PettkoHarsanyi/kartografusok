import { socketApi } from "../../socket/SocketApi"

export const INIT_ROOM = "INIT_ROOM"

export const initRoom = (user,roomCode) => ({
    type: INIT_ROOM,
    payload: {leader:user,roomCode:roomCode}
})

// export const createRoom = (user) => (dispatch) => {
//     socketApi.createRoom(user,dispatch)
// }