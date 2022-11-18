import { END_GAME, END_GAME_LOCAL, GAME_FINISHED, GAME_FINISHED_LOCAL, GAME_STARTED, GAME_STARTED_LOCAL, INIT_ROOM, UPDATE_ROOM, UPDATE_ROOM_LOCAL } from "./actions";

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

    if(type === GAME_FINISHED){
        return {...state, gameResult: payload}
    }

    if(type === GAME_FINISHED_LOCAL){
        return {...state, gameResult: payload}
    }

    if(type === UPDATE_ROOM){
        return {...state, leader: payload}
    }

    if(type === UPDATE_ROOM_LOCAL){
        return {...state, leader: payload}
    }

    if(type === END_GAME){
        return {...state, gameEnded: true}
    }
    
    if(type === END_GAME_LOCAL){
        return {...state, gameEnded: true}
    }

    return state;
}