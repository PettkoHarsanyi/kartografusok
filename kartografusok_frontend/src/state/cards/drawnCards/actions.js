export const DRAW_CARD = "DRAW_CARD"
export const DRAW_CARD_LOCAL = "DRAW_CARD_LOCAL"
export const ROTATE_BLOCKS = "ROTATE_BLOCKS"
export const CLEAR_DRAWN_CARDS = "CLEAR_DRAWN_CARDS"

export const drawCard = (card) => ({
    type: DRAW_CARD,
    payload: card,
})

export const clearDrawnCards = () => ({
    type: CLEAR_DRAWN_CARDS,
    payload: null,
})