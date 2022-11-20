import { ADD_MAP_TO_PLAYER, ADD_PLAYER, ADD_PLAYER_LOCAL, MODIFY_PLAYER, MODIFY_PLAYER_LOCAL, MUTE_PLAYER, REMOVE_PLAYER, REMOVE_PLAYER_LOCAL, UNREADY_PLAYERS, UNREADY_PLAYERS_LOCAL } from "./actions";

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

    if(type === REMOVE_PLAYER_LOCAL){
        return players.filter(player => player.id !== payload.id)
    }

    if(type === MUTE_PLAYER){
        return players.map(player => {
            if(player.id === payload.id)
                return {...payload, muted: !payload.muted}
            return player
        })
    }

    if(type === MODIFY_PLAYER){
        return players.map(player => {
            if(player.id === payload.id){
                return payload
            }
            return player;
        })
    }

    if(type === MODIFY_PLAYER_LOCAL){
        return players.map(player => {
            if(player.id === payload.id){
                return payload;
            }
            return player;
        })
    }

    if(type=== ADD_PLAYER_LOCAL){
        return [...players, payload];
    }

    if(type===ADD_MAP_TO_PLAYER){
        return players.map(player => {
            if(player.id === payload.user.id){
                return {...payload.user, map: payload.map}
            }
            return player;
        })
    }

    if(type === UNREADY_PLAYERS){
        return players.map(player => {
            return {...player, isReady: false}
        })
    }

    if(type === UNREADY_PLAYERS_LOCAL){
        return players.map(player => {
            return {...player, isReady: false}
        })
    }

    return state;
};