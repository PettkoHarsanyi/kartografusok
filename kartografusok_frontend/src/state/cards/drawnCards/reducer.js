import { CLEAR_DRAWN_CARDS, DRAW_CARD, DRAW_CARD_LOCAL, ROTATE_BLOCKS } from "./actions";

export const drawnCardsInitialState = [];

export const drawnCardsReducer = (state = drawnCardsInitialState, action) => {
    const { type, payload } = action;
    const cards = state;
    
    if(type===DRAW_CARD){
        return [...state, payload]
    }

    if(type === CLEAR_DRAWN_CARDS){
        return [];
    }
    return state;
};