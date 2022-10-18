import { ADD_PLAYER } from "./actions";

export const playersInitialState = []

// const initialState = []

export const playersReducer = (state = playersInitialState, action) => {
    const { type, payload } = action;
    const players = state;

    if (type === ADD_PLAYER) {
        return [...players, payload];
    }

    return state;
};