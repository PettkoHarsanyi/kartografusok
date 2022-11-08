import { DRAW_CARD, DRAW_CARD_LOCAL } from "../drawnCards/actions";
import { INIT_DECK } from "./actions";

export const deckInitialState = [];

export const deckReducer = (state = deckInitialState, action) => {
    const { type, payload } = action;
    const cards = state;
    
    if(type == INIT_DECK){
        return payload;
    }

    if(type===DRAW_CARD){
        return state.filter(card => card.id !== payload.id);
    }

    return state;
};