import { MODIFY_PLAYER_LOCAL, REMOVE_PLAYER, REMOVE_PLAYER_LOCAL, UNREADY_PLAYERS } from "../players/actions";
import { ADD_MAP_TO_ACTUAL_PLAYER, INIT_PLAYER,MODIFY_ACTUAL_PLAYER,MODIFY_PLAYER } from "./actions";

export const actualPlayerReducerInitialState = {}

export const actualPlayerReducer = (state = actualPlayerReducerInitialState, action) => {
    const { type, payload } = action;

    if(type === INIT_PLAYER){
        return payload
    }

    if(type=== MODIFY_PLAYER){
        if(payload.id === state.id){
            return payload;
        }
        return state;
    }

    if(type === MODIFY_PLAYER_LOCAL){
        if(payload.id === state.id){
            return payload;
        }
        return state;
    }

    if(type === MODIFY_ACTUAL_PLAYER){
        if(payload.id === state.id){
            return payload;
        }
        return state;
    }

    if(type === ADD_MAP_TO_ACTUAL_PLAYER){
        return {...state, map: payload}
    }

    if(type === UNREADY_PLAYERS){
        return {...state,isReady: false};
    }

    if(type === REMOVE_PLAYER){
        if(payload.id === state.id){
            return {...state, kicked: true};
        }
        return state;
    }

    if(type === REMOVE_PLAYER_LOCAL){
        if(payload.id === state.id){
            return {...state, kicked: true};
        }
        return state;
    }

    return state;
};