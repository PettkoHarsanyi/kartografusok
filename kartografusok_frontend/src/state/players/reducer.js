const initialState = [
    {
        name: "Peti",
        age: 23,
    },
    {
        name: "Adi",
        age: 29
    }
]

export const playersReducer = (state = initialState, action) => {
    const { type, payload } = action;
    const players = state;

    if (type === "ADD_PLAYER") {
        return [...players, payload];
    }

    return state;
};