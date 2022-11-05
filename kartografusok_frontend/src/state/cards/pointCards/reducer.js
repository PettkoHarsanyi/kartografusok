import { INIT_POINT_CARDS } from "./actions";

export const pointCardsInitialState = [
    {
        id: 0,
        name:"Gazdag síkság",
        points: 3,
        picture:"pointcards/gazdagsiksag.png",
        backPicture:"pointcards/villageback.png"
    },
    {
        id: 1,
        name:"Nagyváros",
        points: 1,
        picture:"pointcards/nagyvaros.png",
        backPicture:"pointcards/villageback.png"
    },
    {
        id: 2,
        name:"Üstvidék",
        points: 1,
        picture:"pointcards/ustvidek.png",
        backPicture:"pointcards/diagonalback.png"
    },
    {
        id: 3,
        name:"Pajzsfal",
        points: 2,
        picture:"pointcards/pajzsfal.png",
        backPicture:"pointcards/villageback.png"
    },
    {
        id: 4,
        name:"Elveszett birtok",
        points: 3,
        picture:"pointcards/elveszettbirtok.png",
        backPicture:"pointcards/diagonalback.png"
    },
    {
        id: 5,
        name:"Töredezett utak",
        points: 3,
        picture:"pointcards/toredezettutak.png",
        backPicture:"pointcards/diagonalback.png"
    },
    {
        id: 6,
        name:"Kőmelléki erdő",
        points: 3,
        picture:"pointcards/komellekierdo.png",
        backPicture:"pointcards/forestback.png"
    },
    {
        id: 7,
        name:"Partmenti terjeszkedés",
        points: 3,
        picture:"pointcards/partmentiterjeszkedes.png",
        backPicture:"pointcards/farmwaterback.png"
    },
    {
        id: 8,
        name:"Zöld Gally",
        points: 1,
        picture:"pointcards/zoldgally.png",
        backPicture:"pointcards/forestback.png"
    },
    {
        id: 9,
        name:"Fatorony",
        points: 1,
        picture:"pointcards/fatorony.png",
        backPicture:"pointcards/forestback.png"
    },
    {
        id: 10,
        name:"Az arany magtár",
        points: 3,
        alterPoints: 1,
        picture:"pointcards/azaranymagtar.png",
        backPicture:"pointcards/farmwaterback.png"
    },
    {
        id: 11,
        name:"Faőrszem",
        points: 1,
        picture:"pointcards/faorszem.png",
        backPicture:"pointcards/forestback.png"
    },
    {
        id: 12,
        name:"Mágusok völgye",
        points: 2,
        alterPoints: 1,
        picture:"pointcards/magusokvolgye.png",
        backPicture:"pointcards/farmwaterback.png"
    },
    {
        id: 13,
        name:"Csatorna tó",
        points: 1,
        picture:"pointcards/csatornato.png",
        backPicture:"pointcards/farmwaterback.png"
    },
    {
        id: 14,
        name:"Vadközösség",
        points: 8,
        picture:"pointcards/vadkozosseg.png",
        backPicture:"pointcards/villageback.png"
    },
    {
        id: 15,
        name:"Határvidék",
        points: 6,
        picture:"pointcards/hatarvidek.png",
        backPicture:"pointcards/diagonalback.png"
    },
]

export const pointCardsReducer = (state = pointCardsInitialState, action) => {
    const { type, payload } = action;

    if(type === INIT_POINT_CARDS){
        return payload;
    }

    return state;
};