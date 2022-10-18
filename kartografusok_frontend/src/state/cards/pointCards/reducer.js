export const pointCardsInitialState = [
    {
        name:"Gazdag síkság",
        points: 3
    },
    {
        name:"Nagyváros",
        points: 1
    },
    {
        name:"Üstvidék",
        points: 1
    },
    {
        name:"Pajzsfal",
        points: 2
    },
    {
        name:"Elveszett birtok",
        points: 3
    },
    {
        name:"Töredezett utak",
        points: 3
    },
    {
        name:"Kőmelléki erdő",
        points: 3
    },
    {
        name:"Partmenti terjeszkedés",
        points: 3
    },
    {
        name:"Zöld Gally",
        points: 1
    },
    {
        name:"Fatorony",
        points: 1
    },
    {
        name:"Az arany magtár",
        points: 3,
        alterPoints: 1
    },
    {
        name:"Faőrszem",
        points: 1
    },
    {
        name:"Mágusok völgye",
        points: 2,
        alterPoints: 1
    },
    {
        name:"Csatorna tó",
        points: 1
    },
    {
        name:"Vadközösség",
        points: 8
    },
    {
        name:"Határvidék",
        points: 6
    },
]

export const pointCardsReducer = (state = pointCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};