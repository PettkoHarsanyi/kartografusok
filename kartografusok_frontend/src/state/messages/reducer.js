const initialState = [
    {
        user: "Peti",
        message: "Szia",
    },
    {
        user: "Adi",
        message: "Heló",
    }
]

export const messagesReducer = (state = initialState, action) => {
    const { type, payload } = action;

    return state;
};