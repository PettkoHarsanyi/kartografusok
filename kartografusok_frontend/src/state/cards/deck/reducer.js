import { INIT_DECK } from "./actions";

export const deckInitialState = [];

export const deckReducer = (state = deckInitialState, action) => {
    const { type, payload } = action;
    const cards = state;
    
    if(type == INIT_DECK){
        return payload;
    }

    return state;
};