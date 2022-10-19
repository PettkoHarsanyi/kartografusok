export const decreeCardsInitialState = [
    {
        id: 1,
        name:"A"
    },
    {
        id: 2,
        name:"B"
    },
    {
        id: 3,
        name:"C"
    },
    {
        id: 4,
        name:"D"
    },
]

export const decreeCardsReducer = (state = decreeCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};