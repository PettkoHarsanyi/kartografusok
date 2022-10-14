const initialState = [
    {
        name: "Erdei Mano",
        power: "Ad eletet",
    },
    {
        name: "Vizi sello",
        power: "Elkabit",
    },
]

export const cardsReducer = (state = initialState, action) => {
    const { type, payload } = action;

    return state;
};