export const INIT_PLAYER = "INIT_PLAYER"
export const MODIFY_PLAYER = "MODIFY_PLAYER"

export const initActualPlayer = (user) => ({
    type: INIT_PLAYER,
    payload: user
})

export const modifyPlayer = (user) => ({
    type: MODIFY_PLAYER,
    payload: user,
})