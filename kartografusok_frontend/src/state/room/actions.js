import { socketApi } from "../../socket/SocketApi"

export const INIT_ROOM = "INIT_ROOM"
export const GAME_STARTED = "GAME_STARTED"
export const GAME_STARTED_LOCAL = "GAME_STARTED_LOCAL"
export const GAME_FINISHED = "GAME_FINISHED"
export const GAME_FINISHED_LOCAL = "GAME_FINISHED_LOCAL"
export const UPDATE_ROOM = "UPDATE_ROOM"
export const UPDATE_ROOM_LOCAL = "UPDATE_ROOM_LOCAL"
export const END_GAME = "END_GAME"
export const END_GAME_LOCAL = "END_GAME_LOCAL"

export const initRoom = (user,roomCode) => ({
    type: INIT_ROOM,
    payload: {leader:user,roomCode:roomCode}
})

export const updateRoom = (user) => ({
    type: UPDATE_ROOM,
    payload: user
})

export const gameStarted = (isStarted) => ({
    type: GAME_STARTED,
    payload: isStarted,
})

export const gameFinished = (gameResult) => ({
    type: GAME_FINISHED,
    payload: gameResult
})
// export const createRoom = (user) => (dispatch) => {
//     socketApi.createRoom(user,dispatch)
// }

export const endGame = () => ({
    type: END_GAME,
    payload: {}
})