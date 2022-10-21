export const decreeCardsInitialState = [
    {
        id: 1,
        name:"A",
        picture:"A.png",
        backPicture:"A.png"
    },
    {
        id: 2,
        name:"B",
        picture:"B.png",
        backPicture:"B.png"
    },
    {
        id: 3,
        name:"C",
        picture:"C.png",
        backPicture:"C.png"
    },
    {
        id: 4,
        name:"D",
        picture:"D.png",
        backPicture:"D.png"
    },
]

export const decreeCardsReducer = (state = decreeCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};