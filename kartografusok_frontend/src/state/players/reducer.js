import { ADD_PLAYER, MUTE_PLAYER, REMOVE_PLAYER } from "./actions";

export const playersInitialState = []

// const initialState = []

export const playersReducer = (state = playersInitialState, action) => {
    const { type, payload } = action;
    const players = state;

    if (type === ADD_PLAYER) {
        return [...players, payload];
    }

    if(type === REMOVE_PLAYER){
        return players.filter(player => player.id !== payload.id)
    }

    if(type === MUTE_PLAYER){
        return players.map(player => {
            if(player.id === payload.id)
                return {...payload, muted: !payload.muted}
            return player
        })
    }

    return state;
};