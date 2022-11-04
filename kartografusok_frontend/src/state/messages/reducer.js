import { ADD_MESSAGE, ADD_MESSAGE_LOCAL } from "./actions";

export const messagesInitialState = []

export const messagesReducer = (state = messagesInitialState, action) => {
    const { type, payload } = action;
    const messages = state;

    if (type === ADD_MESSAGE) {
        return [...messages, payload];
    }

    if (type === ADD_MESSAGE_LOCAL) {
        return [...messages, payload];
    }


    return state;
};