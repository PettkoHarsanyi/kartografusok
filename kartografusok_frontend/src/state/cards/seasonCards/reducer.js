export const seasonCardsInitialState = [
    {
        name:"Tél",
        duration:6
    },
    {
        name:"Tavasz",
        duration:8
    },
    {
        name:"Nyár",
        duration:8
    },
    {
        name:"Ősz",
        duration:7
    },

]

export const seasonCardsReducer = (state = seasonCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};