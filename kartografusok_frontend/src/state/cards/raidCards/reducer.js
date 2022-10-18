export const raidCardsInitialState = [
    {
        name:"Goblin portya",
        shape:"1-1-1",
        direction:-1
    },
    {
        name:"Gnoll fosztogatás",
        shape:"2-1-2",
        direction:-1
    },
    {
        name:"Vadember roham",
        shape:"1 1 - 1 1",
        direction: 1
    },
    {
        name:"Kobold tombolás",
        shape:"1-2-1",
        direction:1
    },
]

export const raidCardsReducer = (state = raidCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};