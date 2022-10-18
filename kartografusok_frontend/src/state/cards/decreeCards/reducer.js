export const decreeCardsInitialState = [
    {
        name:"A"
    },
    {
        name:"B"
    },
    {
        name:"C"
    },
    {
        name:"D"
    },
]

export const decreeCardsReducer = (state = decreeCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};