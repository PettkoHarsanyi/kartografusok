import { INIT_PLAYER,MODIFY_PLAYER } from "./actions";

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

    return state;
};