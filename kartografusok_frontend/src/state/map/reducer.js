import { INIT_MAP } from "./actions";

export const mapReducerInitialState = {}

export const mapReducer = (state = mapReducerInitialState, action) => {
    const { type, payload } = action;

    if(type === INIT_MAP){
        return payload
    }

    return state;
};