export const pointCardsInitialState = [
    {
        id: 1,
        name:"Gazdag síkság",
        points: 3
    },
    {
        id: 2,
        name:"Nagyváros",
        points: 1
    },
    {
        id: 3,
        name:"Üstvidék",
        points: 1
    },
    {
        id: 4,
        name:"Pajzsfal",
        points: 2
    },
    {
        id: 5,
        name:"Elveszett birtok",
        points: 3
    },
    {
        id: 6,
        name:"Töredezett utak",
        points: 3
    },
    {
        id: 7,
        name:"Kőmelléki erdő",
        points: 3
    },
    {
        id: 8,
        name:"Partmenti terjeszkedés",
        points: 3
    },
    {
        id: 9,
        name:"Zöld Gally",
        points: 1
    },
    {
        id: 10,
        name:"Fatorony",
        points: 1
    },
    {
        id: 11,
        name:"Az arany magtár",
        points: 3,
        alterPoints: 1
    },
    {
        id: 12,
        name:"Faőrszem",
        points: 1
    },
    {
        id: 13,
        name:"Mágusok völgye",
        points: 2,
        alterPoints: 1
    },
    {
        id: 14,
        name:"Csatorna tó",
        points: 1
    },
    {
        id: 15,
        name:"Vadközösség",
        points: 8
    },
    {
        id: 16,
        name:"Határvidék",
        points: 6
    },
]

export const pointCardsReducer = (state = pointCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};