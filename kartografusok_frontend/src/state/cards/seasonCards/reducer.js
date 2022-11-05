export const seasonCardsInitialState = [
    {
        id: 0,
        name: "Tavasz",
        duration: 8,
        picture: "seasoncards/tavasz.png",
        backPicture: "seasoncards/seasonback.png"
    },
    {
        id: 1,
        name: "Nyár",
        duration: 8,
        picture: "seasoncards/nyar.png",
        backPicture: "seasoncards/seasonback.png"
    },
    {
        id: 2,
        name: "Ősz",
        duration: 7,
        picture: "seasoncards/osz.png",
        backPicture: "seasoncards/seasonback.png"
    },
    {
        id: 3,
        name: "Tél",
        duration: 6,
        picture: "seasoncards/tel.png",
        backPicture: "seasoncards/seasonback.png"
    }
]

export const seasonCardsReducer = (state = seasonCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};