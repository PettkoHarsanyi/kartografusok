export const seasonCardsInitialState = [
    {
        id: 1,
        name:"Tél",
        duration:6
    },
    {
        id: 2,
        name:"Tavasz",
        duration:8
    },
    {
        id: 3,
        name:"Nyár",
        duration:8
    },
    {
        id: 4,
        name:"Ősz",
        duration:7
    },

]

export const seasonCardsReducer = (state = seasonCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};