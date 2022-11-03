export const ADD_PLAYER = "ADD_PLAYER"
export const REMOVE_PLAYER = "REMOVE_PLAYER"
export const MUTE_PLAYER = "MUTE_PLAYER"
export const MODIFY_PLAYER = "MODIFY_PLAYER"

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