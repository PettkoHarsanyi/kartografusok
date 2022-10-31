import { INIT_PLAYER } from "./actions";

export const actualPlayerReducerInitialState = {}

export const actualPlayerReducer = (state = actualPlayerReducerInitialState, action) => {
    const { type, payload } = action;

    if(type === INIT_PLAYER){
        return payload
    }

    return state;
};