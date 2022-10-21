export const seasonCardsInitialState = [
    {
        id: 1,
        name:"Tél",
        duration:6,
        picture:"tel.png",
        backPicture:"seasonback.png"
    },
    {
        id: 2,
        name:"Tavasz",
        duration:8,
        picture:"tavasz.png",
        backPicture:"seasonback.png"
    },
    {
        id: 3,
        name:"Nyár",
        duration:8,
        picture:"nyar.png",
        backPicture:"seasonback.png"
    },
    {
        id: 4,
        name:"Ősz",
        duration:7,
        picture:"osz.png",
        backPicture:"seasonback.png"
    },

]

export const seasonCardsReducer = (state = seasonCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};