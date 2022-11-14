import { DRAW_CARD } from "../drawnCards/actions";

export const _allDrawnCardsInitialState = [];

export const _allDrawnCardsReducer = (state = _allDrawnCardsInitialState, action) => {
    const { type, payload } = action;
    const cards = state;

    if (type === DRAW_CARD) {
        return [...state, payload]
    }
    
    return state;
}