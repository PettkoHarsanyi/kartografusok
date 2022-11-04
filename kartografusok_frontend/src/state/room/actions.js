import { socketApi } from "../../socket/SocketApi"

export const INIT_ROOM = "INIT_ROOM"
export const GAME_STARTED = "GAME_STARTED"
export const GAME_STARTED_LOCAL = "GAME_STARTED_LOCAL"

export const initRoom = (user,roomCode) => ({
    type: INIT_ROOM,
    payload: {leader:user,roomCode:roomCode}
})

export const gameStarted = (isStarted) => ({
    type: GAME_STARTED,
    payload: isStarted,
})

// export const createRoom = (user) => (dispatch) => {
//     socketApi.createRoom(user,dispatch)
// }