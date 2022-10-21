export const pointCardsInitialState = [
    {
        id: 1,
        name:"Gazdag síkság",
        points: 3,
        picture:"gazdagsiksag.png",
        backPicture:"villageback.png"
    },
    {
        id: 2,
        name:"Nagyváros",
        points: 1,
        picture:"nagyvaros.png",
        backPicture:"villageback.png"
    },
    {
        id: 3,
        name:"Üstvidék",
        points: 1,
        picture:"ustvidek.png",
        backPicture:"diagonalback.png"
    },
    {
        id: 4,
        name:"Pajzsfal",
        points: 2,
        picture:"pajzsfal.png",
        backPicture:"villageback.png"
    },
    {
        id: 5,
        name:"Elveszett birtok",
        points: 3,
        picture:"elveszettbirtok.png",
        backPicture:"diagonalback.png"
    },
    {
        id: 6,
        name:"Töredezett utak",
        points: 3,
        picture:"toredezettutak.png",
        backPicture:"diagonalback.png"
    },
    {
        id: 7,
        name:"Kőmelléki erdő",
        points: 3,
        picture:"komellekierdo.png",
        backPicture:"forestback.png"
    },
    {
        id: 8,
        name:"Partmenti terjeszkedés",
        points: 3,
        picture:"partmentiterjeszkedes.png",
        backPicture:"farmwaterback.png"
    },
    {
        id: 9,
        name:"Zöld Gally",
        points: 1,
        picture:"zoldgally.png",
        backPicture:"forestback.png"
    },
    {
        id: 10,
        name:"Fatorony",
        points: 1,
        picture:"fatorony.png",
        backPicture:"forestback.png"
    },
    {
        id: 11,
        name:"Az arany magtár",
        points: 3,
        alterPoints: 1,
        picture:"azaranymagtar.png",
        backPicture:"farmwaterback.png"
    },
    {
        id: 12,
        name:"Faőrszem",
        points: 1,
        picture:"faorszem.png",
        backPicture:"forestback.png"
    },
    {
        id: 13,
        name:"Mágusok völgye",
        points: 2,
        alterPoints: 1,
        picture:"magusokvolgye.png",
        backPicture:"farmwaterback.png"
    },
    {
        id: 14,
        name:"Csatorna tó",
        points: 1,
        picture:"csatornato.png",
        backPicture:"farmwaterback.png"
    },
    {
        id: 15,
        name:"Vadközösség",
        points: 8,
        picture:"vadkozosseg.png",
        backPicture:"villageback.png"
    },
    {
        id: 16,
        name:"Határvidék",
        points: 6,
        picture:"hatarvidek.png",
        backPicture:"diagonalback.png"
    },
]

export const pointCardsReducer = (state = pointCardsInitialState, action) => {
    const { type, payload } = action;

    return state;
};