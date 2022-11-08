import { DRAW_CARD, DRAW_CARD_LOCAL } from "./actions";

export const drawnCardsInitialState = [];

export const drawnCardsReducer = (state = drawnCardsInitialState, action) => {
    const { type, payload } = action;
    const cards = state;
    
    if(type===DRAW_CARD){
        return [...state, payload]
    }

    return state;
};