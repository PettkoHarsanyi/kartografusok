import { MODIFY_PLAYER_LOCAL } from "../players/actions";
import { INIT_PLAYER,MODIFY_ACTUAL_PLAYER,MODIFY_PLAYER } from "./actions";

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

    return state;
};