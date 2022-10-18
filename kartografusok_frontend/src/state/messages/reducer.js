import { ADD_MESSAGE } from "./actions";

export const messagesInitialState = []

export const messagesReducer = (state = messagesInitialState, action) => {
    const { type, payload } = action;
    const messages = state;

    if (type === ADD_MESSAGE) {
        return [...messages, payload];
    }

    return state;
};