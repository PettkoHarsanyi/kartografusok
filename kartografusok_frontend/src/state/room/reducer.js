import { GAME_STARTED, GAME_STARTED_LOCAL, INIT_ROOM } from "./actions";

export const roomInitialState = {}

export const roomReducer = (state = roomInitialState,action) => {
    const {type,payload} = action;

    if(type===INIT_ROOM){
        const {leader,roomCode} = payload;
        return {leader:leader, roomCode:roomCode}
    }

    if(type === GAME_STARTED){
        return {...state, gameStarted: payload}
    }

    if(type === GAME_STARTED_LOCAL){
        return {...state, gameStarted: payload}
    }

    return state;
}