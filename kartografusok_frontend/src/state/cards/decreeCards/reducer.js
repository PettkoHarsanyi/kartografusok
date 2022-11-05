export const decreeCardsInitialState = [
    {
        id: 0,
        name:"A",
        picture:"decreecards/A.png",
        backPicture:"decreecards/A.png"
    },
    {
        id: 1,
        name:"B",
        picture:"decreecards/B.png",
        backPicture:"decreecards/B.png"
    },
    {
        id: 2,
        name:"C",
        picture:"decreecards/C.png",
        backPicture:"decreecards/C.png"
    },
    {
        id: 3,
        name:"D",
        picture:"decreecards/D.png",
        backPicture:"decreecards/D.png"
    },
]

export const decreeCardsReducer = (state = decreeCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};