export const exploreCardsInitialState = [
    {
        name:"Lombfalu",
        shape:"2-3"
    },
    {
        name:"Község",
        shape:"1-2 / 3-2"
    },
    {
        name:"Templomrom",
        shape:"Special"
    },
    {
        name:"Nagy folyó",
        shape:"1-1-1 / 1-2-2"
    },
    {
        name:"Átjáró",
        shape:"1"
    },
    {
        name:"Termőföld",
        shape:"1-1 / 1-3-1"
    },
    {
        name:"Gyümölcsöskert",
        shape:"3-1"
    },
    {
        name:"Mocsár",
        shape:"1-3-1"
    },
    {
        name:"Elfeledett erdő",
        shape:"1-1 / 1-2-1"
    },
    {
        name:"Öntözőcsatorna",
        shape:"3-1-1"
    },
    {
        name:"Halászfalu",
        shape:"4"
    },
    {
        name:"Tanya",
        shape:"1-2-1"
    },
    {
        name:"Előőrsrom",
        shape:"SPECIAL"
    },
    
]

export const exploreCardsReducer = (state = exploreCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};