import { ADD_MAP_TO_ACTUAL_PLAYER } from "../actualPlayer/actions"

export const ADD_PLAYER = "ADD_PLAYER"
export const ADD_PLAYER_LOCAL = "ADD_PLAYER_LOCAL"
export const REMOVE_PLAYER = "REMOVE_PLAYER"
export const MUTE_PLAYER = "MUTE_PLAYER"
export const MODIFY_PLAYER = "MODIFY_PLAYER"
export const MODIFY_PLAYER_LOCAL = "MODIFY_PLAYER_LOCAL"
export const ADD_MAP_TO_PLAYER = "ADD_MAP_TO_PLAYER"
export const UNREADY_PLAYERS = "UNREADY_PLAYERS"
export const UNREADY_PLAYERS_LOCAL = "UNREADY_PLAYERS_LOCAL"
export const REMOVE_PLAYER_LOCAL = "REMOVE_PLAYER_LOCAL"

export const addPlayer = (user) => ({
    type: ADD_PLAYER,
    payload: user
})

export const removePlayer = (user) => ({
    type: REMOVE_PLAYER,
    payload: user
})

export const mutePlayer = (user) => ({
    type: MUTE_PLAYER,
    payload: user
})

export const modifyPlayer = (user) => ({
    type: MODIFY_PLAYER,
    payload: user,
})

export const modifyLocalPlayer = (user) => ({
    type: MODIFY_PLAYER_LOCAL,
    payload: user,
})

export const addMapToPlayer = (user,map) => ({
    type: ADD_MAP_TO_PLAYER,
    payload: {user,map},
})

export const setPlayersUnReady = () => ({
    type: UNREADY_PLAYERS,
    payload: {},
})