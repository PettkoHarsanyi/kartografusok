import { INIT_ROOM } from "./actions";

export const roomInitialState = {}

export const roomReducer = (state = roomInitialState,action) => {
    const {type,payload} = action;

    if(type===INIT_ROOM){
        const {leader,roomCode} = payload;
        return {leader:leader, roomCode:roomCode}
    }

    return state;
}