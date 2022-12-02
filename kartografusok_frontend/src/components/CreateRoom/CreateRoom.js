import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import authService from '../../auth/auth.service';
import axios from 'axios';
import "../../css/CreateRoom.css";
import authHeader from '../../auth/auth-header';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, sendMessage } from '../../state/messages/actions';
import { getMessages } from '../../state/messages/selectors';
import { addMapToPlayer, addPlayer, modifyPlayer, mutePlayer, removePlayer } from '../../state/players/actions';
import { getPlayers } from '../../state/players/selectors';
import { fillExploreCards } from '../../state/cards/exploreCards/actions';
import { fillRaidCards } from '../../state/cards/raidCards/actions';
import guestpic from "../../assets/profileimage.png"
import unmuted from "../../assets/playerunmute.png"
import muted from "../../assets/playermute.png"
import kick from "../../assets/delete.png"
import { initMap } from '../../state/map/actions';
import { addMapToActualPlayer, initActualPlayer } from '../../state/actualPlayer/actions';
import { createRoom, gameStarted, initRoom, updateRoom } from '../../state/room/actions';
import { wsConnect } from '../../state/store';
import { getRoom } from '../../state/room/selectors';
import { getState } from '../../state/selector';
import { socketApi } from '../../socket/SocketApi';
import { getCards } from '../../state/cards/selector';
import { initPointCards } from '../../state/cards/pointCards/actions';
import { initDeck } from '../../state/cards/deck/actions';
import { getMap } from '../../state/map/selectors';
import { getActualPlayer } from '../../state/actualPlayer/selectors';

export default function CreateRoom() {
    const actualPlayer = useSelector(getActualPlayer);
    const [user, setUser] = useState(authService.getCurrentUser() ?? actualPlayer);
    // const [users,setUsers] = useState([user]);
    // const [messages, setMessages] = useState([]);
    const loadedData = useLoaderData();
    const navigate = useNavigate();

    const [exploreCards] = useState(loadedData[0]); // DB-ből jön, mert dinamikus, a többi stateből
    const [raidCards] = useState(loadedData[1]); // DB-ből jön, mert dinamikus, a többi stateből
    const [maps] = useState(loadedData[2]); // DB-ből jön, mert dinamikus, a többi stateből

    const dispatch = useDispatch()
    const cards = useSelector(getCards);
    const messages = useSelector(getMessages);
    const room = useSelector(getRoom);
    const state = useSelector(getState);
    const players = useSelector(getPlayers);
    const map = useSelector(getMap);

    useEffect(() => {
        if (!socketApi.isConnected()) {
            dispatch(wsConnect());
        }
        if (!user.id) {
            dispatch({
                type: "CLEAR_STATE"
            })
            navigate("/")
        }
    }, [])

    useEffect(() => {
        let actualUser = players.find(finduser => finduser.id === user.id)
        if (actualUser) {
            setUser(players.find(finduser => finduser.id === user.id))
        }
    }, [players])

    const getRandomMap = () => {
        return maps[Math.floor(Math.random() * maps.length)]
    }

    const createRoomAck = (obj) => {
        dispatch(initRoom(user, obj.roomId))
    }

    const syncStateAck = (obj) => {
        // console.log(obj);
    }

    const syncActionAck = (obj) => {
        // console.log(obj);
    }

    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const randomize4PointCards = () => {
        const shuffled = cards.pointCards.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 4);
        dispatch(initPointCards(selected));

        // const testPointCards = [{id: 0,name: "Gazdag síkság",points: 3,picture: "pointcards/gazdagsiksag.png",backPicture: "pointcards/villageback.png"},{id: 1,name: "Nagyváros",points: 1,picture: "pointcards/nagyvaros.png",backPicture: "pointcards/villageback.png"},{id: 2,name: "Üstvidék",points: 1,picture: "pointcards/ustvidek.png",backPicture: "pointcards/diagonalback.png"},{id: 3,name: "Pajzsfal",points: 2,picture: "pointcards/pajzsfal.png",backPicture: "pointcards/villageback.png"},]
        // dispatch(initPointCards(testPointCards));
    }

    const randomizeExploreCards = () => {
        const shuffledRaidCards = cards.raidCards.sort(() => 0.5 - Math.random());
        let selectedRaidCards = shuffledRaidCards.slice(0, 4);
        const merged = cards.exploreCards.concat(selectedRaidCards)
        const shuffledMerged = merged.sort(() => 0.5 - Math.random());
        const temp = [].concat(cards.exploreCards.sort(() => 0.5 - Math.random()));
        let secondShuffledMerged = temp.sort(() => 0.5 - Math.random());
        // Második pakli id-jainak cseréje
        secondShuffledMerged = secondShuffledMerged.map((card) => {
            return { ...card, id: card.id + merged.length + 50, duplicate: true, pictureId: card.id }
        })
        const shuffledMergedDeck = shuffledMerged.concat(secondShuffledMerged);
        dispatch(initDeck(shuffledMergedDeck));

        // const ruinThenRaidTestDeck = [{id: 8,name: 'Elfeledett erdő',duration: 1,picture: 'elfeledetterdo.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: null,direction: null,blocks1: '[[1,0],[0,1]]',blocks2: '[[1,0],[1,1],[0,1]]',createdAt: '2022-10-18T21:39:00.521Z',modifiedAt: '2022-10-18T21:39:00.521Z'},{id: 17,name: 'Előőrsrom',duration: null,picture: 'eloorsrom.png',official: true,cardType: 'RUIN',fieldType1: null,fieldType2: null,direction: null,blocks1: null,blocks2: null,createdAt: '2022-10-18T21:47:43.965Z',modifiedAt: '2022-10-18T21:47:43.965Z'},{id: 39,name: 'Ózdi roham',duration: null,picture: 'customraid.png',official: false,cardType: 'RAID',fieldType1: 'MONSTER',fieldType2: null,direction: 1,blocks1: '[[1,1,1],[1,1,1]]',blocks2: null,createdAt: '2022-10-27T20:16:19.683Z',modifiedAt: '2022-10-27T20:16:19.683Z'},{id: 11,name: 'Község',duration: 1,picture: 'kozseg.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: null,direction: null,blocks1: '[[1,0],[1,1]]',blocks2: '[[1,1,1],[1,1,0]]',createdAt: '2022-10-18T21:41:10.312Z',modifiedAt: '2022-10-18T21:41:10.312Z'},]
        // dispatch(initDeck(ruinThenRaidTestDeck));

        // const twoRuinTestDeck = [{id: 8,name: 'Elfeledett erdő',duration: 1,picture: 'elfeledetterdo.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: null,direction: null,blocks1: '[[1,0],[0,1]]',blocks2: '[[1,0],[1,1],[0,1]]',createdAt: '2022-10-18T21:39:00.521Z',modifiedAt: '2022-10-18T21:39:00.521Z'},{id: 16,name: 'Templomrom',duration: null,picture: 'templomrom.png',official: true,cardType: 'RUIN',fieldType1: null,fieldType2: null,direction: null,blocks1: null,blocks2: null,createdAt: '2022-10-18T21:47:30.887Z',modifiedAt: '2022-10-18T21:47:30.887Z'},{id: 17,name: 'Előőrsrom',duration: null,picture: 'eloorsrom.png',official: true,cardType: 'RUIN',fieldType1: null,fieldType2: null,direction: null,blocks1: null,blocks2: null,createdAt: '2022-10-18T21:47:43.965Z',modifiedAt: '2022-10-18T21:47:43.965Z'},{id: 11,name: 'Község',duration: 1,picture: 'kozseg.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: null,direction: null,blocks1: '[[1,0],[1,1]]',blocks2: '[[1,1,1],[1,1,0]]',createdAt: '2022-10-18T21:41:10.312Z',modifiedAt: '2022-10-18T21:41:10.312Z'},]
        // dispatch(initDeck(twoRuinTestDeck));

        // const ruinThenCantFitTestDeck = [{id: 38,name: 'Ózd',duration: null,picture: 'customexplore.png',official: false,cardType: 'RUIN',fieldType1: null,fieldType2: null,direction: null,blocks1: null,blocks2: null,createdAt: '2022-10-27T20:00:52.857Z',modifiedAt: '2022-10-27T20:00:52.857Z'},{id: 76,name: 'Öntözőcsatorna',duration: 2,picture: 'ontozocsatorna.png',official: true,cardType: 'EXPLORE',fieldType1: 'FARM',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1],[1,0,0],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:33:37.196Z',modifiedAt: '2022-10-18T21:33:37.196Z',duplicate: true,pictureId: 4},{id: 73,name: 'Halászfalu',duration: 2,picture: 'halaszfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1,1]]',blocks2: null,createdAt: '2022-10-18T21:28:50.574Z',modifiedAt: '2022-10-18T21:28:50.574Z',duplicate: true,pictureId: 1},{id: 6,name: 'Mocsár',duration: 2,picture: 'mocsar.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'WATER',direction: null,blocks1: '[[1,0,0],[1,1,1],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:35:26.564Z',modifiedAt: '2022-10-18T21:35:26.564Z'}]
        // dispatch(initDeck(ruinThenCantFitDeck))

        // const lotOfCardsThenRuinFitTestDeck = [{id: 4,name: 'Öntözőcsatorna',duration: 2,picture: 'ontozocsatorna.png',official: true,cardType: 'EXPLORE',fieldType1: 'FARM',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1],[1,0,0],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:33:37.196Z',modifiedAt: '2022-10-18T21:33:37.196Z'},{id: 6,name: 'Mocsár',duration: 2,picture: 'mocsar.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'WATER',direction: null,blocks1: '[[1,0,0],[1,1,1],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:35:26.564Z',modifiedAt: '2022-10-18T21:35:26.564Z'},{id: 7,name: 'Termőföld',duration: 1,picture: 'termofold.png',official: true,cardType: 'EXPLORE',fieldType1: 'FARM',fieldType2: null,direction: null,blocks1: '[[1],[1]]',blocks2: '[[0,1,0],[1,1,1],[0,1,0]]',createdAt: '2022-10-18T21:36:57.217Z',modifiedAt: '2022-10-18T21:36:57.217Z'},{id: 48,name: 'Zsófi kártyája',duration: 6,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'FOREST',direction: null,blocks1: '[[1,1,1,1]]',blocks2: '',createdAt: '2022-11-06T01:10:29.807Z',modifiedAt: '2022-11-06T01:10:29.807Z'},{id: 8,name: 'Elfeledett erdő',duration: 1,picture: 'elfeledetterdo.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: null,direction: null,blocks1: '[[1,0],[0,1]]',blocks2: '[[1,0],[1,1],[0,1]]',createdAt: '2022-10-18T21:39:00.521Z',modifiedAt: '2022-10-18T21:39:00.521Z'},{id: 1,name: 'Halászfalu',duration: 2,picture: 'halaszfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1,1]]',blocks2: null,createdAt: '2022-10-18T21:28:50.574Z',modifiedAt: '2022-10-18T21:28:50.574Z'},{id: 9,name: 'Gyümölcsöskert',duration: 2,picture: 'gyumolcsoskert.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'FARM',direction: null,blocks1: '[[1,1,1],[0,0,1]]',blocks2: null,createdAt: '2022-10-18T21:39:41.101Z',modifiedAt: '2022-10-18T21:39:41.101Z'},{id: 2,name: 'Tanya',duration: 2,picture: 'tanya.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'FARM',direction: null,blocks1: '[[1,0],[1,1],[1,0]]',blocks2: null,createdAt: '2022-10-18T21:31:21.834Z',modifiedAt: '2022-10-18T21:31:21.834Z'},{id: 11,name: 'Község',duration: 1,picture: 'kozseg.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: null,direction: null,blocks1: '[[1,0],[1,1]]',blocks2: '[[1,1,1],[1,1,0]]',createdAt: '2022-10-18T21:41:10.312Z',modifiedAt: '2022-10-18T21:41:10.312Z'},{id: 5,name: 'Nagy folyó',duration: 1,picture: 'nagyfolyo.png',official: true,cardType: 'EXPLORE',fieldType1: 'WATER',fieldType2: null,direction: null,blocks1: '[[1],[1],[1]]',blocks2: '[[0,0,1],[0,1,1],[1,1,0]]',createdAt: '2022-10-18T21:34:45.096Z',modifiedAt: '2022-10-18T21:34:45.096Z'},{id: 17,name: 'Előőrsrom',duration: null,picture: 'eloorsrom.png',official: true,cardType: 'RUIN',fieldType1: null,fieldType2: null,direction: null,blocks1: null,blocks2: null,createdAt: '2022-10-18T21:47:43.965Z',modifiedAt: '2022-10-18T21:47:43.965Z'},{id: 10,name: 'Lombfalu',duration: 2,picture: 'lombfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[0,0,1,1],[1,1,1,0]]',blocks2: null,createdAt: '2022-10-18T21:40:18.741Z',modifiedAt: '2022-10-18T21:40:18.741Z'},{id: 35,name: 'Uganda',duration: 1,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[1,1]]',blocks2: '[[1,1,1,1]]',createdAt: '2022-10-27T19:45:57.784Z',modifiedAt: '2022-10-27T19:45:57.784Z'},]
        // dispatch(initDeck(lotOfCardsThenRuinFitTestDeck));

        // const lotOfCardsThenRuinThenOnlyOneBlockCanFitTestDeck = [{id: 6,name: 'Mocsár',duration: 2,picture: 'mocsar.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'WATER',direction: null,blocks1: '[[1,0,0],[1,1,1],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:35:26.564Z',modifiedAt: '2022-10-18T21:35:26.564Z'},{id: 5,name: 'Nagy folyó',duration: 1,picture: 'nagyfolyo.png',official: true,cardType: 'EXPLORE',fieldType1: 'WATER',fieldType2: null,direction: null,blocks1: '[[1],[1],[1]]',blocks2: '[[0,0,1],[0,1,1],[1,1,0]]',createdAt: '2022-10-18T21:34:45.096Z',modifiedAt: '2022-10-18T21:34:45.096Z'},{id: 9,name: 'Gyümölcsöskert',duration: 2,picture: 'gyumolcsoskert.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'FARM',direction: null,blocks1: '[[1,1,1],[0,0,1]]',blocks2: null,createdAt: '2022-10-18T21:39:41.101Z',modifiedAt: '2022-10-18T21:39:41.101Z'},{id: 11,name: 'Község',duration: 1,picture: 'kozseg.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: null,direction: null,blocks1: '[[1,0],[1,1]]',blocks2: '[[1,1,1],[1,1,0]]',createdAt: '2022-10-18T21:41:10.312Z',modifiedAt: '2022-10-18T21:41:10.312Z'},{id: 10,name: 'Lombfalu',duration: 2,picture: 'lombfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[0,0,1,1],[1,1,1,0]]',blocks2: null,createdAt: '2022-10-18T21:40:18.741Z',modifiedAt: '2022-10-18T21:40:18.741Z'},{id: 8,name: 'Elfeledett erdő',duration: 1,picture: 'elfeledetterdo.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: null,direction: null,blocks1: '[[1,0],[0,1]]',blocks2: '[[1,0],[1,1],[0,1]]',createdAt: '2022-10-18T21:39:00.521Z',modifiedAt: '2022-10-18T21:39:00.521Z'},{id: 4,name: 'Öntözőcsatorna',duration: 2,picture: 'ontozocsatorna.png',official: true,cardType: 'EXPLORE',fieldType1: 'FARM',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1],[1,0,0],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:33:37.196Z',modifiedAt: '2022-10-18T21:33:37.196Z'},{id: 38,name: 'Ózd',duration: null,picture: 'customexplore.png',official: false,cardType: 'RUIN',fieldType1: null,fieldType2: null,direction: null,blocks1: null,blocks2: null,createdAt: '2022-10-27T20:00:52.857Z',modifiedAt: '2022-10-27T20:00:52.857Z'},{id: 7,name: 'Termőföld',duration: 1,picture: 'termofold.png',official: true,cardType: 'EXPLORE',fieldType1: 'FARM',fieldType2: null,direction: null,blocks1: '[[1],[1]]',blocks2: '[[0,1,0],[1,1,1],[0,1,0]]',createdAt: '2022-10-18T21:36:57.217Z',modifiedAt: '2022-10-18T21:36:57.217Z'},{id: 35,name: 'Uganda',duration: 1,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[1,1]]',blocks2: '[[1,1,1,1]]',createdAt: '2022-10-27T19:45:57.784Z',modifiedAt: '2022-10-27T19:45:57.784Z'},]
        // dispatch(initDeck(lotOfCardsThenRuinThenOnlyOneBlockCanFitTestDeck));

        // const lotOfCardsThenRuinThenMonsterRoundCantFitTesDeck = [{id: 8,name: 'Elfeledett erdő',duration: 1,picture: 'elfeledetterdo.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: null,direction: null,blocks1: '[[1,0],[0,1]]',blocks2: '[[1,0],[1,1],[0,1]]',createdAt: '2022-10-18T21:39:00.521Z',modifiedAt: '2022-10-18T21:39:00.521Z'},{id: 2,name: 'Tanya',duration: 2,picture: 'tanya.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'FARM',direction: null,blocks1: '[[1,0],[1,1],[1,0]]',blocks2: null,createdAt: '2022-10-18T21:31:21.834Z',modifiedAt: '2022-10-18T21:31:21.834Z'},{id: 10,name: 'Lombfalu',duration: 2,picture: 'lombfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[0,0,1,1],[1,1,1,0]]',blocks2: null,createdAt: '2022-10-18T21:40:18.741Z',modifiedAt: '2022-10-18T21:40:18.741Z'},{id: 6,name: 'Mocsár',duration: 2,picture: 'mocsar.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'WATER',direction: null,blocks1: '[[1,0,0],[1,1,1],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:35:26.564Z',modifiedAt: '2022-10-18T21:35:26.564Z'},{id: 4,name: 'Öntözőcsatorna',duration: 2,picture: 'ontozocsatorna.png',official: true,cardType: 'EXPLORE',fieldType1: 'FARM',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1],[1,0,0],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:33:37.196Z',modifiedAt: '2022-10-18T21:33:37.196Z'},{id: 1,name: 'Halászfalu',duration: 2,picture: 'halaszfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1,1]]',blocks2: null,createdAt: '2022-10-18T21:28:50.574Z',modifiedAt: '2022-10-18T21:28:50.574Z'},{id: 38,name: 'Ózd',duration: null,picture: 'customexplore.png',official: false,cardType: 'RUIN',fieldType1: null,fieldType2: null,direction: null,blocks1: null,blocks2: null,createdAt: '2022-10-27T20:00:52.857Z',modifiedAt: '2022-10-27T20:00:52.857Z'},{id: 14,name: 'Gnoll fosztogatás',duration: null,picture: 'gnollfosztogatas.png',official: true,cardType: 'RAID',fieldType1: 'MONSTER',fieldType2: null,direction: -1,blocks1: '[[1,1],[1,0],[1,1]]',blocks2: null,createdAt: '2022-10-18T21:46:06.216Z',modifiedAt: '2022-10-18T21:46:06.216Z'},{id: 3,name: 'Átjáró',duration: 0,picture: 'atjaro.png',official: true,cardType: 'EXPLORE',fieldType1: 'ANY',fieldType2: null,direction: null,blocks1: '[[1]]',blocks2: null,createdAt: '2022-10-18T21:32:25.228Z',modifiedAt: '2022-10-18T21:32:25.228Z'},]
        // dispatch(initDeck(lotOfCardsThenRuinThenMonsterRoundCantFitTesDeck));

        // const firstMonsterRoundTestDeck = [{id: 14,name: 'Gnoll fosztogatás',duration: null,picture: 'gnollfosztogatas.png',official: true,cardType: 'RAID',fieldType1: 'MONSTER',fieldType2: null,direction: -1,blocks1: '[[1,1],[1,0],[1,1]]',blocks2: null,createdAt: '2022-10-18T21:46:06.216Z',modifiedAt: '2022-10-18T21:46:06.216Z'},{id: 8,name: 'Elfeledett erdő',duration: 1,picture: 'elfeledetterdo.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: null,direction: null,blocks1: '[[1,0],[0,1]]',blocks2: '[[1,0],[1,1],[0,1]]',createdAt: '2022-10-18T21:39:00.521Z',modifiedAt: '2022-10-18T21:39:00.521Z'},{id: 35,name: 'Uganda',duration: 1,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[1,1]]',blocks2: '[[1,1,1,1]]',createdAt: '2022-10-27T19:45:57.784Z',modifiedAt: '2022-10-27T19:45:57.784Z'},]
        // dispatch(initDeck(firstMonsterRoundTestDeck));

        // const secondMonsterRoundTestDeck = [{id: 8,name: 'Elfeledett erdő',duration: 1,picture: 'elfeledetterdo.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: null,direction: null,blocks1: '[[1,0],[0,1]]',blocks2: '[[1,0],[1,1],[0,1]]',createdAt: '2022-10-18T21:39:00.521Z',modifiedAt: '2022-10-18T21:39:00.521Z'},{id: 14,name: 'Gnoll fosztogatás',duration: null,picture: 'gnollfosztogatas.png',official: true,cardType: 'RAID',fieldType1: 'MONSTER',fieldType2: null,direction: -1,blocks1: '[[1,1],[1,0],[1,1]]',blocks2: null,createdAt: '2022-10-18T21:46:06.216Z',modifiedAt: '2022-10-18T21:46:06.216Z'},{id: 35,name: 'Uganda',duration: 1,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[1,1]]',blocks2: '[[1,1,1,1]]',createdAt: '2022-10-27T19:45:57.784Z',modifiedAt: '2022-10-27T19:45:57.784Z'},]
        // dispatch(initDeck(secondMonsterRoundTestDeck));

        // const twoMonsterRoundTestDeck = [{id: 5,name: 'Nagy folyó',duration: 1,picture: 'nagyfolyo.png',official: true,cardType: 'EXPLORE',fieldType1: 'WATER',fieldType2: null,direction: null,blocks1: '[[1],[1],[1]]',blocks2: '[[0,0,1],[0,1,1],[1,1,0]]',createdAt: '2022-10-18T21:34:45.096Z',modifiedAt: '2022-10-18T21:34:45.096Z'},{id: 47,name: 'Peti haragja',duration: null,picture: 'customraid.png',official: false,cardType: 'RAID',fieldType1: 'MONSTER',fieldType2: null,direction: 1,blocks1: '[[1,0,1],[1,1,1]]',blocks2: null,createdAt: '2022-10-28T17:23:31.272Z',modifiedAt: '2022-10-28T17:23:31.272Z'},{id: 44,name: 'Erős Pista',duration: null,picture: 'customraid.png',official: false,cardType: 'RAID',fieldType1: 'MONSTER',fieldType2: null,direction: 1,blocks1: '[[1,1]]',blocks2: null,createdAt: '2022-10-27T21:10:39.368Z',modifiedAt: '2022-10-27T21:10:39.368Z'},{id: 2,name: 'Tanya',duration: 2,picture: 'tanya.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'FARM',direction: null,blocks1: '[[1,0],[1,1],[1,0]]',blocks2: null,createdAt: '2022-10-18T21:31:21.834Z',modifiedAt: '2022-10-18T21:31:21.834Z'}]
        // dispatch(initDeck(twoMonsterRoundTestDeck));

        // const monsterAfterPointingTestDeck = [{id: 10,name: 'Lombfalu',duration: 2,picture: 'lombfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[0,0,1,1],[1,1,1,0]]',blocks2: null,createdAt: '2022-10-18T21:40:18.741Z',modifiedAt: '2022-10-18T21:40:18.741Z'},{id: 6,name: 'Mocsár',duration: 2,picture: 'mocsar.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'WATER',direction: null,blocks1: '[[1,0,0],[1,1,1],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:35:26.564Z',modifiedAt: '2022-10-18T21:35:26.564Z'},{id: 2,name: 'Tanya',duration: 2,picture: 'tanya.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'FARM',direction: null,blocks1: '[[1,0],[1,1],[1,0]]',blocks2: null,createdAt: '2022-10-18T21:31:21.834Z',modifiedAt: '2022-10-18T21:31:21.834Z'},{id: 1,name: 'Halászfalu',duration: 2,picture: 'halaszfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1,1]]',blocks2: null,createdAt: '2022-10-18T21:28:50.574Z',modifiedAt: '2022-10-18T21:28:50.574Z'},{id: 50,name: 'Gonosz futam',duration: null,picture: 'customraid.png',official: false,cardType: 'RAID',fieldType1: 'MONSTER',fieldType2: null,direction: 1,blocks1: '[[1,1],[1,1]]',blocks2: null,createdAt: '2022-11-06T01:11:55.526Z',modifiedAt: '2022-11-06T01:11:55.526Z'}, {id: 8,name: 'Elfeledett erdő',duration: 1,picture: 'elfeledetterdo.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: null,direction: null,blocks1: '[[1,0],[0,1]]',blocks2: '[[1,0],[1,1],[0,1]]',createdAt: '2022-10-18T21:39:00.521Z',modifiedAt: '2022-10-18T21:39:00.521Z'},]
        // dispatch(initDeck(monsterAfterPointingTestDeck));


        // const seasonsLastCardIsRuinTestDeck = [{id: 6,name: 'Mocsár',duration: 2,picture: 'mocsar.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'WATER',direction: null,blocks1: '[[1,0,0],[1,1,1],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:35:26.564Z',modifiedAt: '2022-10-18T21:35:26.564Z'},{id: 1,name: 'Halászfalu',duration: 2,picture: 'halaszfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1,1]]',blocks2: null,createdAt: '2022-10-18T21:28:50.574Z',modifiedAt: '2022-10-18T21:28:50.574Z'},{id: 34,name: 'Mordor',duration: 2,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'ANY',fieldType2: '',direction: null,blocks1: '[[1,1]]',blocks2: '',createdAt: '2022-10-27T19:40:11.919Z',modifiedAt: '2022-10-27T19:40:11.919Z'}, {id: 35,name: 'Uganda',duration: 1,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[1,1]]',blocks2: '[[1,1,1,1]]',createdAt: '2022-10-27T19:45:57.784Z',modifiedAt: '2022-10-27T19:45:57.784Z'},{id: 38,name: 'Ózd',duration: null,picture: 'customexplore.png',official: false,cardType: 'RUIN',fieldType1: null,fieldType2: null,direction: null,blocks1: null,blocks2: null,createdAt: '2022-10-27T20:00:52.857Z',modifiedAt: '2022-10-27T20:00:52.857Z'},{id: 9,name: 'Gyümölcsöskert',duration: 2,picture: 'gyumolcsoskert.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'FARM',direction: null,blocks1: '[[1,1,1],[0,0,1]]',blocks2: null,createdAt: '2022-10-18T21:39:41.101Z',modifiedAt: '2022-10-18T21:39:41.101Z'},{id: 3,name: 'Átjáró',duration: 0,picture: 'atjaro.png',official: true,cardType: 'EXPLORE',fieldType1: 'ANY',fieldType2: null,direction: null,blocks1: '[[1]]',blocks2: null,createdAt: '2022-10-18T21:32:25.228Z',modifiedAt: '2022-10-18T21:32:25.228Z'},]
        // dispatch(initDeck(seasonsLastCardIsRuinTestDeck));


        // const seasonEndThenRuinTestDeck = [{id: 6,name: 'Mocsár',duration: 2,picture: 'mocsar.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'WATER',direction: null,blocks1: '[[1,0,0],[1,1,1],[1,0,0]]',blocks2: null,createdAt: '2022-10-18T21:35:26.564Z',modifiedAt: '2022-10-18T21:35:26.564Z'},{id: 1,name: 'Halászfalu',duration: 2,picture: 'halaszfalu.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: 'WATER',direction: null,blocks1: '[[1,1,1,1]]',blocks2: null,createdAt: '2022-10-18T21:28:50.574Z',modifiedAt: '2022-10-18T21:28:50.574Z'},{id: 34,name: 'Mordor',duration: 2,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'ANY',fieldType2: '',direction: null,blocks1: '[[1,1]]',blocks2: '',createdAt: '2022-10-27T19:40:11.919Z',modifiedAt: '2022-10-27T19:40:11.919Z'}, {id: 9,name: 'Gyümölcsöskert',duration: 2,picture: 'gyumolcsoskert.png',official: true,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'FARM',direction: null,blocks1: '[[1,1,1],[0,0,1]]',blocks2: null,createdAt: '2022-10-18T21:39:41.101Z',modifiedAt: '2022-10-18T21:39:41.101Z'},{id: 38,name: 'Ózd',duration: null,picture: 'customexplore.png',official: false,cardType: 'RUIN',fieldType1: null,fieldType2: null,direction: null,blocks1: null,blocks2: null,createdAt: '2022-10-27T20:00:52.857Z',modifiedAt: '2022-10-27T20:00:52.857Z'},{id: 35,name: 'Uganda',duration: 1,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'FOREST',fieldType2: 'VILLAGE',direction: null,blocks1: '[[1,1]]',blocks2: '[[1,1,1,1]]',createdAt: '2022-10-27T19:45:57.784Z',modifiedAt: '2022-10-27T19:45:57.784Z'},{id: 3,name: 'Átjáró',duration: 0,picture: 'atjaro.png',official: true,cardType: 'EXPLORE',fieldType1: 'ANY',fieldType2: null,direction: null,blocks1: '[[1]]',blocks2: null,createdAt: '2022-10-18T21:32:25.228Z',modifiedAt: '2022-10-18T21:32:25.228Z'},]
        // dispatch(initDeck(seasonEndThenRuinTestDeck));

        // const vademberRohamFirstMonsterCardTestDeck = [{id: 15,name: 'Vadember roham',duration: null,picture: 'vademberroham.png',official: true,cardType: 'RAID',fieldType1: 'MONSTER',fieldType2: null,direction: 1,blocks1: '[[1,0,1],[1,0,1]]',blocks2: null,createdAt: '2022-10-18T21:46:44.556Z',modifiedAt: '2022-10-18T21:46:44.556Z'},{id: 43,name: 'Picinyke',duration: 1,picture: 'customexplore.png',official: false,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: '',direction: null,blocks1: '[[1]]',blocks2: '[[1,1],[1,1]]',createdAt: '2022-10-27T21:09:51.506Z',modifiedAt: '2022-10-27T21:09:51.506Z'},{id: 11,name: 'Község',duration: 1,picture: 'kozseg.png',official: true,cardType: 'EXPLORE',fieldType1: 'VILLAGE',fieldType2: null,direction: null,blocks1: '[[1,0],[1,1]]',blocks2: '[[1,1,1],[1,1,0]]',createdAt: '2022-10-18T21:41:10.312Z',modifiedAt: '2022-10-18T21:41:10.312Z'},]
        // dispatch(initDeck(vademberRohamFirstMonsterCardTestDeck));

    }

    useEffect(() => {
        if (players.length === 0) {               // CSAK ANNÁL FUT LE, AKI CSINÁLJA A SZOBÁT
            // const randomMap = getRandomMap();
            const randomMap = maps[3];
            dispatch(initMap(randomMap));
            dispatch(initActualPlayer({ ...user, isReady: false, gamePoints: 0 }));
            dispatch(addMapToActualPlayer(randomMap.blocks));
            dispatch(addPlayer({ ...user, map: randomMap.blocks, isReady: false, gamePoints: 0 }))
            // console.log("Ive been called");
            dispatch(fillExploreCards(exploreCards));
            dispatch(fillRaidCards(raidCards));
            randomize4PointCards();
            // randomizeExploreCards();
        }
    }, [])

    useEffect(() => {
        if (players.length === 1) {               // CSAK ANNÁL FUT LE, AKI CSINÁLJA A SZOBÁT
            //console.log("cards have changed");          // ITT AZÉRT PLAYERS.LENGTH === 1, MERT ITT MÁR A LEADER BENT VAN, []-nál még nincs
            randomizeExploreCards();
        }

    }, [cards.exploreCards, cards.raidCards])

    useEffect(() => {
        if (players.length === 1) {
            if (!room.roomCode) {
                // console.log("ITT LEFUTOTTAM, MEGCSINÁLTAM A SZOBÁT");
                socketApi.createRoom(user, createRoomAck);
            }
        }
        // if(players.length===0){
        //     dispatch(initMap(getRandomMap()))
        //     dispatch(fillExploreCards(exploreCards));
        //     dispatch(fillRaidCards(raidCards));
        //     dispatch(wsConnect())
        //     socketApi.createRoom(user,createRoomAck);
        // }
        // // if(players.length>1){
        // //     socketApi.syncAction(room.roomCode,{type:"ADD_PLAYER",payload:user},true,syncActionAck)
        // // }
        // console.log(players);
        if (room?.roomCode) socketApi.syncState(room.roomCode, state, true, (ack) => {/*console.log(ack)*/ })
    }, [players])

    useEffect(() => {
        if (players.length === 1) {
            if (room.leader.id === user.id) {
                // console.log("FELKÜLDTEM A SZOBÁT")
                socketApi.syncState(room.roomCode, state, true, (ack) => {/*console.log(ack)*/ })
            } else {
                // console.log("NEM KÜLDTEM MÁR FEL SEMMIT, A LEADER FELKÜLDTE A SYNCET, LEGKÖZELEBB CSAK ADD PLAYERNÉL KELL")
            }
        }
        // if(room.roomCode && players.length === 0){              // AMIKOR A SZOBA LÉTREHOZÓ VAN CSAK BELÉPVE
        //     socketApi.syncState(room.roomCode,state,true,syncStateAck)  // AMIKOR A SZOBA LÉTREJÖTT ÉS BEÁLLÍTÓDOTT A STATEJA
        // }
    }, [room])

    // useEffect(()=>{
    //     if(players.length > 0){
    //         socketApi.syncState(room.roomCode, state, true, (ack) => {/*console.log(ack)*/ })
    //     }
    // },[players])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const input = document.getElementById('input')

        if (input.value !== "") {
            let message = "";
            if (!user.isGuest) {
                const response = await axios.post(`api/users/${user.id}/message`, {
                    message: input.value,
                }, {
                    headers: authHeader()
                });

                message = response.data;

                message.user = user; // Azért kell, mert a responseban nem tudom populálni a user-t
            }
            else {
                message = { user: user, id: -messages.length, message: input.value }
            }


            // dispatch(addMessage(message))
            dispatch(addMessage(message))

            input.value = ""

            input.focus({ focusVisible: true });
        }

    }

    const getBorderAndBoxShadow = (division) => {
        switch (division.id) {
            case 4:
                return {
                    boxShadow: "0 0 6vh 1vh rgba(72, 0, 255, 0.901), inset 0 0 32px 3vh rgba(72, 0, 255, 0.901)",
                    zIndex: 4
                }
            case 3:
                return {
                    boxShadow: "0 0 6vh 1vh rgba(255, 225, 0, 0.918), inset 0 0 32px 3vh rgba(255, 225, 0, 0.918)",
                    zIndex: 3
                }
            case 2:
                return {
                    boxShadow: "0 0 3vh 1vh rgba(170, 209, 222, 0.918), inset 0 0 32px 3vh rgba(170, 209, 222, 0.918)",
                    zIndex: 2
                }
            case 1:
                return {
                    boxShadow: "0 0 3vh 1vh rgba(186, 118, 0, 0.852),inset 0 0 32px 3vh rgba(186, 118, 0, 0.852)",
                    zIndex: 1
                }
            default:
                return {
                    boxShadow: "none",
                    zIndex: 1
                }
        }
    }

    useEffect(() => {
        var chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight;
    }, [messages])

    useEffect(() => {
        if (room.gameStarted && room.gameStarted === true) {
            // console.log("game has started");
            navigate("/jatek");
        }
    }, [room])

    const copy = (b) => {
        var copyText = document.getElementById("roomId");
        copyText.select();
        copyText.setSelectionRange(0, 99999);

        document.execCommand("copy");

        if (b) {
            document.getElementById("copyButton").innerHTML = "Másolva ✔";
            document.getElementById("copyButton").setAttribute("class", "Copied")
        }
    }

    const copyDefault = () => {
        document.getElementById("copyButton").innerHTML = "Kimásolás";
        document.getElementById("copyButton").setAttribute("class", "CopyButton")
    }

    const muteUser = (_user) => {
        dispatch(modifyPlayer({ ..._user, muted: !_user.muted }));
    }

    const kickUser = (_user) => {
        dispatch(removePlayer(_user));
    }

    const handleStartGame = (e) => {
        e.preventDefault();
        dispatch(gameStarted(true));
    }

    const clearState = (e, to) => {
        // EMIATT BAJ LEHET
        if (e !== null) {
            e.preventDefault();
        }
        dispatch({
            type: "CLEAR_STATE"
        });
        navigate(to);
    }

    useEffect(() => {
        if (actualPlayer.kicked) {
            socketApi.leaveRoom(room.roomCode, (ack) => {/*console.log(ack)*/ })
            clearState(null, "/");
        }
    }, [actualPlayer])

    return (
        <div className='CreateRoom'>
            <div className='Div2'>
                <div className='Div3'>
                    <div className='DivTitle'>Csatlakozott játékosok:</div>
                    <div className='PlayersDiv'>
                        {players && players.length > 0 && players.map((_user) => {
                            return (
                                <div key={_user.id} className='PlayerDiv'>
                                    <div className='MuteBanDiv'>
                                        {_user.id !== user.id && room?.leader.id === user.id && <>
                                            <img onClick={() => muteUser(_user)} src={_user.muted ? muted : unmuted} draggable="false" />
                                            <img onClick={() => kickUser(_user)} src={kick} draggable="false" />
                                        </>}
                                    </div>
                                    <div className='PicsDiv'>
                                        <img src={_user?.isGuest ? guestpic : `api/users/${_user.id}/profileimage`} style={getBorderAndBoxShadow(_user.division)} draggable="false" className="PictureDiv" alt="profilpics" />
                                    </div>
                                    <div className='InfoDiv'>{_user.name}<br />{_user.division.name}</div>
                                </div>)
                        })
                        }
                    </div>
                </div>
                <div className='Div4'>
                    <form className='ChatDiv' onSubmit={(e) => handleSendMessage(e)} autoComplete="off">
                        <div className='ChatDivContent' id="chat">
                            {messages && messages.length > 0 &&
                                messages.map((message, index) => {
                                    return (<div key={message.id} className='Message'><div className='MessagerName'>{message.user.name}</div><div className='MessageText'>{message.message}</div></div>)
                                })
                            }
                        </div>
                        <div className='ChatDivInput'>
                            <input disabled={actualPlayer.muted} style={{ cursor: user.muted ? "not-allowed" : "text" }} className='ChatInput' id="input" placeholder={actualPlayer.muted ? 'Némítva vagy🤐' : 'Levelezés 😂📯📩✍'} />
                            <button disabled={actualPlayer.muted} style={{ cursor: user.muted ? "not-allowed" : "pointer" }} className='ChatButton' type='submit'>{actualPlayer.muted ? '🚫' : "Küldés"}</button>
                        </div>
                    </form>
                    <div className='ServerInfoDiv'>
                        <div className='TextDiv'>
                            <div>Szoba: {room.leader?.name} szobája</div>
                            {/* <div>Pálya nehézsége: könnyű nehéz</div> */}
                            <div>Csatlakozott játékosok: {players.length}</div>
                            <div>Szobakód:</div>
                            <div className='InviteDiv'>
                                <input className='CodeDiv' id="roomId" defaultValue={room.roomCode} readOnly onClick={() => copy(false)} />
                                <button className='CopyButton' id="copyButton" onClick={() => copy(true)} onMouseLeave={copyDefault}>Kimásolás</button>
                            </div>
                        </div>
                        <div className='ButtonDiv'>
                            <Link to="/" onClick={(e) => {
                                if (players.length > 1 && actualPlayer.id === room.leader.id) {
                                    dispatch(updateRoom(players[1]));
                                }
                                dispatch(removePlayer(actualPlayer));
                                socketApi.leaveRoom(room.roomCode, (ack) => {/*console.log(ack)*/ })
                                clearState(e, "/");
                            }}
                            >Kilépés</Link>
                            <Link onClick={e => {
                                e.preventDefault();
                                if (actualPlayer.id === room.leader.id) {
                                    handleStartGame(e)
                                }
                            }}
                                style={{
                                    cursor: (actualPlayer.id === room?.leader?.id) ? "pointer" : "not-allowed",
                                    backgroundColor: (actualPlayer.id === room?.leader?.id) ? "" : "#1f1f1f",
                                    color: (actualPlayer.id === room?.leader?.id) ? "" : "#5c5c5c",
                                    boxShadow: (actualPlayer.id === room?.leader?.id) ? "" : "none",
                                    opacity: (actualPlayer.id === room?.leader?.id) ? "1" : "0.7"
                                }}
                            >
                                Indítás
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}