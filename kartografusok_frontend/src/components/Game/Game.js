import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Game.css";
import "../../css/InputRange.css";
import "../../css/Modal.css";
import "../../css/Chat.css";
import { getRoom } from "../../state/room/selectors";
import GameModal from "./GameModal";
import { containerClasses } from "@mui/system";
import { modifyLocalPlayer, modifyPlayer, removePlayer, setPlayersLocalUnReady, setPlayersUnReady } from "../../state/players/actions";
import { getActualPlayer } from "../../state/actualPlayer/selectors";
import DrawCanvas from "./DrawCanvas";
import { getPlayers } from "../../state/players/selectors";
import { getMap } from "../../state/map/selectors";
import Map from "./Map";
import { getCards } from "../../state/cards/selector";
import InspectModal from "./InspectModal";
import authService from "../../auth/auth.service";
import { modifyActualPlayer } from "../../state/actualPlayer/actions";
import { getMessages } from "../../state/messages/selectors";
import axios from "axios";
import authHeader from "../../auth/auth-header";
import { addMessage } from "../../state/messages/actions";
import Chat from "./Chat";
import { clearDrawnCards, drawCard } from "../../state/cards/drawnCards/actions";
import Card from "../Admin/Card";
import DrawnCard from "./DrawnCard";
import Blocks from "./Blocks";
import { initDeck } from "../../state/cards/deck/actions";
import WaitingModal from "./WaitingModal";
import RuinModal from "./RuinModal";
import GameEndModal from "./GameEndModal";
import { endGame, gameFinished, updateRoom } from "../../state/room/actions";
import { pointRound } from "./PointRound";
import { socketApi } from "../../socket/SocketApi";
import unmuted from "../../assets/playerunmute.png"
import muted from "../../assets/playermute.png"
import kick from "../../assets/delete.png"
import report from "../../assets/report.png"

export default function Game() {
    const INIT_DRAWING = "INIT_DRAWING";
    const CARD_DRAW = "CARD_DRAW";
    const CARD_PLACE = "CARD_PLACE";
    const FIELD_TYPES = ["FOREST", "VILLAGE", "FARM", "WATER", "MONSTER"]

    const handleCloseModal = (e, id) => {
        if (e.target !== e.currentTarget) return;
        const component = document.getElementById(id);
        component.style.display = "none";
    }

    const actualPlayer = useSelector(getActualPlayer);
    const players = useSelector(getPlayers);
    const map = useSelector(getMap)
    const room = useSelector(getRoom)
    const cards = useSelector(getCards)
    const messages = useSelector(getMessages)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const states = [INIT_DRAWING, CARD_DRAW, CARD_PLACE]
    const [currentState, setCurrentState] = useState(0);
    const [gameStartDate] = useState(new Date());
    const [mapPlayer, setMapPlayer] = useState(actualPlayer);

    const [inspectedCard, setInspectedCard] = useState(null);
    const [seasonIndex, setSeasonIndex] = useState(0);
    const [actualSeasonCard, setActualSeasonCard] = useState(cards.seasonCards[seasonIndex]);
    const [selectedBlock, setSelectedBlock] = useState({ type: "", blocks: "" });
    const [duration, setDuration] = useState(cards.deck[0]?.duration ?? 0);

    // HA BEMEGY EGY MODIFY PLAYER AKKOR AZ BEMEGY AZ ACTUAL PLAYERBE IS, HA HA MEGEGYEZIK A PLAYERS
    // BELI PLAYER ID-JAVAL.
    // TEHÁT MINDIG CSAK A PLAYERS TÖMBÖN KELL VÁLTOZTATGATNI,
    // AZ ÚGY IS BEÁLLÍTÓDIK AZ ACTUAL PLAYERRE IS. (EZT CSAK LOKÁLISAN KELL)
    // ÖSSZEHASONLÍTÁSNÁL LEHET HASZNÁLNI AZ ACTUALPLAYERT, MERT AZONOS A PLAYERSBELIVEL
    // mindez legalábbis papíron =)

    useEffect(() => {
        if (!room.roomCode) {
            dispatch({
                type: "CLEAR_STATE"
            })
            navigate("/")
        } else {
            // dispatch(drawCard(cards.deck[0]))
        };
        // console.log(gameStartDate);
    }, [])

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

    const rotateMatrix = (matrix) => {
        return flipMajorDiagonal(matrix.reverse());
    }

    const flipMajorDiagonal = (matrix) => {
        return matrix[0].map((column, index) => (
            matrix.map(row => row[index])
        ))
    }

    const fitCheck = (_block, _ruin) => {
        let block = _block;
        let ruin = _ruin;
        let playerMap = JSON.parse(actualPlayer.map);
        let canFit = false;

        block.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                let allFieldsFit = true;
                if (cell === 1 && inBounds(ruin.rowIndex - rowIndex, ruin.cellIndex - cellIndex)) {
                    block.forEach((otherBlockRow, otherBlockRowIndex) => {
                        otherBlockRow.forEach((otherBlockCell, otherBlockCellIndex) => {
                            if (otherBlockCell === 1 && inBounds(ruin.rowIndex + (otherBlockRowIndex - rowIndex), ruin.cellIndex + (otherBlockCellIndex - cellIndex))) {
                                allFieldsFit = allFieldsFit && (playerMap[ruin.rowIndex + (otherBlockRowIndex - rowIndex)][ruin.cellIndex + (otherBlockCellIndex - cellIndex)] === 0 || playerMap[ruin.rowIndex + (otherBlockRowIndex - rowIndex)][ruin.cellIndex + (otherBlockCellIndex - cellIndex)] === 1);
                            }
                        })
                    })
                } else {
                    allFieldsFit = false;
                }
                canFit = canFit || allFieldsFit;
            })
        })

        return canFit;
    }

    const canFitOnRuin = (_block) => {
        let canFit = false;
        let block = _block
        let playerMap = JSON.parse(actualPlayer.map);

        // FELADAT: VÉGIGMENNI A TÉRKÉP ÖSSZES RUINJÁN, ELKÉRNI AZ INDEXÉT, ABBÓL AZ INDEXBŐL KIINDULVA MEGNÉZNI
        // A BLOCK MINDEN CELLJÉBŐL KIINDULVA, HOGY A TÖBBI CELL BELEÜTKÖZIK E VALAMI MÁSBA,
        // FORGATVA, TÜKRÖZVE, AKÁRHOGY.

        let ruins = []
        playerMap.forEach((row, rowIndex) => {
            return row.forEach((cell, cellIndex) => {
                if (cell === 1) {
                    ruins.push({ rowIndex: rowIndex, cellIndex: cellIndex })
                }
            })
        })

        ruins.forEach((ruin) => {
            canFit = canFit || fitCheck(block, ruin)
            if (canFit) { return canFit }
            let block90 = rotateMatrix(block);
            canFit = canFit || fitCheck(block90, ruin)
            if (canFit) { return canFit }
            let block180 = rotateMatrix(block90)
            canFit = canFit || fitCheck(block180, ruin)
            if (canFit) { return canFit }
            let block270 = rotateMatrix(block180)
            canFit = canFit || fitCheck(block270, ruin)
        })

        return canFit
    }

    const handleUserKeyPress = (event,type) => {
        if(type==="R"){
            setBlocksAndTypes(blocksAndTypes.map((item) => {
                const blocks = JSON.parse(item.block);
                const rotatedBlocks = JSON.stringify(rotateMatrix(blocks));
                return { ...item, block: rotatedBlocks }
            }))
        }
        if(type === "M"){
            setBlocksAndTypes(blocksAndTypes.map((item) => {
                const blocks = JSON.parse(item.block);
                const mirroredBlocks = JSON.stringify(blocks.map(row => row.reverse()));
                return { ...item, block: mirroredBlocks }
            }))
        }
    };

    const openInspectModal = (card) => {
        setInspectedCard(card);
        document.getElementById("inspectModal").style.display = "flex"
    }

    const selectBlocks = (event, type, blocks) => {
        if (type !== "RUIN") {
            setSelectedBlock({ type, blocks })
        } else {

        }
        if (event.target === event.currentTarget) event.target.style.boxShadow = "inset 0 0 4vh 2vh rgba(0, 140, 187, 0.792)"
    }

    const [blocksAndTypes, setBlocksAndTypes] = useState([]);

    useEffect(() => {
        if (cards.drawnCards.length < 1) return;        // HA VAN HÚZVA KÁRTYA, MINDEN KÁRTYAHÚZÁSNÁL LEFUT
        const card = cards.drawnCards[cards.drawnCards.length - 1];     // A LEGFELSŐ HÚZOTT LAP

        let _blocksAndTypes = [];

        if (card.fieldType1 && card.fieldType1 === "ANY") {
            _blocksAndTypes =                                       // _blocksAndTypesnek BERAKJA MINDET, HA ANY
                FIELD_TYPES.map((fieldType) => {
                    return { type: fieldType, block: card.blocks1 }
                })
        }

        if (card.fieldType1 && card.fieldType1 !== "ANY" && card.blocks1) {     // HA NEM ANY, ÉS VAN fieldtype1, blocks1-JE, HOZZÁADJA AZT.
            _blocksAndTypes = [
                ..._blocksAndTypes,
                { type: card.fieldType1, block: card.blocks1 }
            ]
        }

        if (card.fieldType1 && card.fieldType1 !== "ANY" && card.blocks2) {     // HA NEM ANY, ÉS VAN fieldtype1, blocks2-JE, HOZZÁADJA AZT.
            _blocksAndTypes = [
                ..._blocksAndTypes,
                { type: card.fieldType1, block: card.blocks2 }
            ]
        }

        if (card.fieldType2 && card.fieldType1 !== "ANY" && card.blocks1) {     // HA NEM ANY, ÉS VAN fieldtype2, blocks1-JE, HOZZÁADJA AZT.
            _blocksAndTypes = [
                ..._blocksAndTypes,
                { type: card.fieldType2, block: card.blocks1 }
            ]
        }

        if (card.fieldType2 && card.fieldType1 !== "ANY" && card.blocks2) {     // HA NEM ANY, ÉS VAN fieldtype2, blocks2-JE, HOZZÁADJA AZT.
            _blocksAndTypes = [
                ..._blocksAndTypes,
                { type: card.fieldType2, block: card.blocks2 }
            ]
        }

        setBlocksAndTypes(_blocksAndTypes);         // BERAKJA A blocksAndTypes STATEJÉBE
    }, [cards.drawnCards])

    const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);

    useEffect(() => {
        setSelectedBlockIndex(0);
    }, [cards.drawnCards])
    // HA VÁLTOZIK A HÚZOTT KÁRTYA, AKKOR A KIVÁLASZTOTT INDEXNEK BERAKJA A 0.-AT

    useEffect(() => {
        setSelectedBlock({ type: blocksAndTypes[selectedBlockIndex]?.type ?? "", blocks: blocksAndTypes[selectedBlockIndex]?.block ?? "" })
    }, [blocksAndTypes])
    // HA VÁLTOZNAK A blocksAndTypes AKKOR BERAKJA KIVÁLASZTOTTNAK A selectedBlockIndex INDEXŰT
    // A SELECTEDBLOCKOK ADJA TOVÁBB A MAP-NAK, AZT RAJZOLJA KI

    // TESZTELÉS ALATT, TÖRLENDŐEK
    // useEffect(() => {
    //     if (room.roomCode && cards.deck.length === 0) {             // room.roomCode AZÉRT KELL, MERT REFRESHNÉL LEFUTNA, HIBÁT OKOZNAú
    //         const shuffled = cards.drawnCards.sort(() => 0.5 - Math.random());          // HA ELFOGY A PAKLI, ÚJRAKEVERI
    //         dispatch(initDeck(shuffled));                                               // SZINKRONITÁS JÁTÉKOSOK KÖZÖTT ?!?!?!
    //         dispatch(clearDrawnCards());
    //     }
    // }, [cards.deck])

    // useEffect(()=>{
    //     if(room.roomCode && cards._allDrawnCards.length > 0 && cards.drawnCards.length === 0){
    //         pickCard();
    //     }
    // },[cards.deck])

    const [gameEnd, setGameEnd] = useState(false);

    const [season0Points, setSeason0Points] = useState({ A: 0, B: 0, points: 0 });
    const [season1Points, setSeason1Points] = useState({ A: 0, B: 0, points: 0 });
    const [season2Points, setSeason2Points] = useState({ A: 0, B: 0, points: 0 });
    const [season3Points, setSeason3Points] = useState({ A: 0, B: 0, points: 0 });

    const pickCard = () => {
        console.log("Duration: " + duration);
        console.log("Évszak hossz: " + actualSeasonCard.duration);
        console.log("Évszak index: " + seasonIndex);
        
        if (!gameEnd) {
            if (actualSeasonCard.duration <= duration) {                    // HA AZ ÉVSZAKKÁRTYA <= MINT A JELENLEGI IDŐ SUM
                if(seasonIndex + 1 === 4){
                    setSeasonIndex("END");
                    setActualSeasonCard(cards.seasonCards[0]);        // KÖVI ÉVSZAK
                    // setGameEnd(true);
                }else{
                    setActualSeasonCard(cards.seasonCards[seasonIndex+1]);        // KÖVI ÉVSZAK
                    setSeasonIndex(seasonIndex + 1);                            // KÖVI ÉVSZAK INDEX
                }

                if(seasonIndex+1 !== 4){
                    if (cards.deck[0]?.duration) {                               // HA KÖVI KÁRTYÁNAK VAN IDEJE
                        setDuration(cards.deck[0].duration)                     // BEÁLLÍTJUK A JELENLEGI IDŐ SUMOT ARRA
                    } else {
                        setDuration(0);                                        // KÜLÖNBEN NULLÁRA
                    }
                }else{
                    setDuration(duration + cards.deck[0].duration)
                }
                // dispatch(modifyPlayer({ ...actualPlayer, gamePoints: playerPoints }))

            } else if (cards.deck[0] && cards.deck[0].duration) {                            // HA AZ ÉVSZAKKÁRTYA TÖBB MINT A JELENLEGI IDŐ SUM

                if (cards.drawnCards.length === 0) { // ELSŐ KÁRTYÁNÁL
                    setDuration(cards.deck[0].duration)              // AZ IDŐ SUMHOZ HOZZÁADJUK A KÖVI KÁRTYA IDEJÉT
                } else {
                    setDuration(duration + cards.deck[0].duration)              // AZ IDŐ SUMHOZ HOZZÁADJUK A KÖVI KÁRTYA IDEJÉT
                }
            }
            // várakozás a többi játékos lépésére modal elrejtése.
            document.getElementById("waitingModal").style.visibility = "hidden";

            dispatch(drawCard(cards.deck[0]))
            dispatch(setPlayersUnReady());
        }
    }

    useEffect(() => {
        if (cards.drawnCards.length > 0) {


            let playerPoints = actualPlayer.gamePoints;

            if (seasonIndex === 1) {
                console.log("1. évszak pontozása")
                const result = pointRound(cards.pointCards[0], cards.pointCards[1], JSON.parse(actualPlayer.map), JSON.parse(map.blocks))

                // setSeason0Points({ A: result.A, B: result.B, points: season0Points.points + result.point })
                playerPoints = playerPoints + result.points

                console.log("A: " + result.A + ", B: " + result.B)

                dispatch(modifyPlayer({ ...actualPlayer, gamePoints: playerPoints, season0Points: result }))
            }
            if (seasonIndex === 2) {
                console.log("2. évszak pontozása")
                const result = pointRound(cards.pointCards[1], cards.pointCards[2], JSON.parse(actualPlayer.map), JSON.parse(map.blocks))

                // setSeason1Points({ A: result.A, B: result.B, points: season1Points.points + result.point });
                playerPoints = playerPoints + result.points
                console.log("A: " + result.A + ", B: " + result.B)

                dispatch(modifyPlayer({ ...actualPlayer, gamePoints: playerPoints, season1Points: result }))

            }
            if (seasonIndex === 3) {
                console.log("3. évszak pontozása")
                const result = pointRound(cards.pointCards[2], cards.pointCards[3], JSON.parse(actualPlayer.map), JSON.parse(map.blocks))
                // setSeason2Points({ A: result.A, B: result.B, points: season2Points.points + result.point })
                playerPoints = playerPoints + result.points
                console.log("A: " + result.A + ", B: " + result.B)

                dispatch(modifyPlayer({ ...actualPlayer, gamePoints: playerPoints, season2Points: result }))
            }

            if (seasonIndex === "END" && actualSeasonCard.duration <= duration) {
                // if (seasonIndex === 0 && cards.seasonCards[seasonIndex].duration <= duration && gameEnd === false) {
                console.log("4. évszak pontozása")
                const result = pointRound(cards.pointCards[3], cards.pointCards[0], JSON.parse(actualPlayer.map), JSON.parse(map.blocks))
                // setSeason3Points({ A: result.A, B: result.B, points: season3Points.points + result.point })
                console.log("A: " + result.A + ", B: " + result.B);
    
                dispatch(modifyPlayer({ ...actualPlayer, gamePoints: actualPlayer.gamePoints + result.points, season3Points: result }))
    
                // LOKÁLISAN MÉG NEM JÖTT BE A TÖBBI JÁTÉKOS VÁLTOZÁS, EZÉRT VÉGIG MEGYÜNK RAJTUK
                const newPlayers = players.map(player => {
                    const seasonResult = pointRound(cards.pointCards[3], cards.pointCards[0], JSON.parse(player.map), JSON.parse(map.blocks))
                    return { ...player, gamePoints: player.gamePoints + seasonResult.points, season3Points: seasonResult }
                })
    
                if (room.leader.id === actualPlayer.id) {
                    const gameEndDate = new Date();
                    const gameDuration = Math.round(Math.abs(gameEndDate - gameStartDate) / (60 * 1000))
    
                    const validMessages = messages.filter(message => message.id > 0);
    
                    const orderedArray = players.sort((a, b) => b.gamePoints - a.gamePoints)
    
                    const validPlayers = players.filter(player => player.id > 0);
    
                    let results = [];
                    newPlayers.forEach(player => {
                        if (player.id > 0) {
                            const place = (orderedArray.findIndex(object => object.id === player.id) + 1)
                            results.push(postResult(player, player.gamePoints, place))
    
                            modifyUserPoints(player);
                        }
                    });
    
                    Promise.all(results).then(
                        (responses) => {
                            const newResults = responses.map(response => response.data)
                            postGame(gameDuration, newResults, validPlayers, validMessages);
    
                        }
                    )
    
                }

                setGameEnd(true);
            }
        }
    }, [seasonIndex])

    useEffect(() => {
        // MINDEN JÁTÉKOS VÁLTOZÁSNÁL, AKA BLOCK LERAKÁSNÁL BEVÁRJUK A TÖBBI JÁTÉKOST IS.

        let allReady = true;

        players.forEach(player => {
            if (!player.isReady) {
                allReady = false;       // HA NEM MINDENKI isReady, AKKOR allReady = FALSE
            }
        });

        if (room.roomCode && allReady) {
            pickCard()
        }

        if (!allReady && actualPlayer.isReady) {
            // Várakozás a többi játékos lépésére modal kirajzolása.
            document.getElementById("waitingModal").style.visibility = "visible";
        }
    }, [players])

    const [canBuildAnywhere, setCanBuildAnywhere] = useState(true);

    useEffect(() => {
        // HA AZ ELŐZŐ ÉS A MOSTANI KÖR IS MONSTER, ELŐSZÖR VISSZA KELL ÁLLÍTANI EREDETI JÁTÉKOSHOZ (ELŐZŐ SZÖRNY DIRECTIONJA, AZTÁN AZ ÚJ DIRECTIONJÁBA)
        if (cards.drawnCards[cards.drawnCards.length - 1]?.fieldType1 === "MONSTER" && cards.drawnCards[cards.drawnCards.length - 2]?.fieldType1 === "MONSTER") {
            const firstDirection = cards.drawnCards[cards.drawnCards.length - 2].direction
            const secondDirection = cards.drawnCards[cards.drawnCards.length - 1].direction

            const unShiftedPlayers = players;

            const index = unShiftedPlayers.findIndex(player => {
                return player.id === actualPlayer.id;
            })

            // players.forEach((player, index) => {
            //     let whose;
            //     if ((index - firstDirection + secondDirection) > players.length - 1) {
            //         whose = 0;
            //     } else if ((index - firstDirection + secondDirection) < 0) {
            //         whose = players.length - 1
            //     } else {
            //         whose = (index - firstDirection + secondDirection);
            //     }
            // })

            let whose;
            if ((index - firstDirection + secondDirection) > players.length - 1) {
                whose = 0;
            } else if ((index - firstDirection + secondDirection) < 0) {
                whose = players.length - 1
            } else {
                whose = (index - firstDirection + secondDirection);
            }

            dispatch(modifyLocalPlayer({ ...actualPlayer, map: unShiftedPlayers[whose].map, fields: unShiftedPlayers[whose].fields }))
        }

        if (cards.drawnCards[cards.drawnCards.length - 1]?.fieldType1 === "MONSTER" && cards.drawnCards[cards.drawnCards.length - 2]?.fieldType1 !== "MONSTER") {  // HA A SZÖRNY KÖR VAN
            // ELSHIFTELJÜK A JÁTÉKOSOK MAP-JÁT ÉS FIELDS-JEIT
            const direction = cards.drawnCards[cards.drawnCards.length - 1].direction
            // console.log("IRÁNY:" + direction);

            const unShiftedPlayers = players;

            const index = unShiftedPlayers.findIndex(player => {
                return player.id === actualPlayer.id;
            })

            let whose;
            if (index + direction > players.length - 1) {
                whose = 0;
            } else if (index + direction < 0) {
                whose = players.length - 1
            } else {
                whose = index + direction;
            }

            setMapPlayer(unShiftedPlayers[whose])

            const randomTime = Math.floor(Math.random() * 1001);
            // GYANÚS
            console.log("RandomTime: " + randomTime);

            // ELŐSZÖR LEPONTOZZA UTÁNA CSERÉL...
            // TEHÁT HA PONT CSERE VAN ÉS 
            setTimeout(()=>{
                dispatch(modifyLocalPlayer({
                    ...actualPlayer, map: unShiftedPlayers[whose].map, fields: unShiftedPlayers[whose].fields,
                    season0Points: unShiftedPlayers[whose].season0Points,
                    season1Points: unShiftedPlayers[whose].season1Points,
                    season2Points: unShiftedPlayers[whose].season2Points,
                    season3Points: unShiftedPlayers[whose].season3Points,
                }))

            },randomTime)
        }
        if (cards.drawnCards[cards.drawnCards.length - 2]?.fieldType1 === "MONSTER" && cards.drawnCards[cards.drawnCards.length - 1]?.fieldType1 !== "MONSTER") {  // HA VÉGET ÉRT A SZÖRNY KÖR
            // VISSZASHIFTELJÜK A JÁTÉKOSOK MAP-JÁT ÉS FIELDS-JEIT

            const direction = cards.drawnCards[cards.drawnCards.length - 2].direction
            const unShiftedPlayers = players;

            const index = unShiftedPlayers.findIndex(player => {
                return player.id === actualPlayer.id;
            })

            let whose;
            if (index - direction > players.length - 1) {
                whose = 0;
            } else if (index - direction < 0) {
                whose = players.length - 1
            } else {
                whose = index - direction;
            }

            setMapPlayer(players[index])
            // console.log("Beállítom " + players[whose].name + " dolgait arra amit most változtattam")

            // GYANÚS

            const randomTime = Math.floor(Math.random() * 1001);
            console.log("RandomTime: " + randomTime);
            setTimeout(()=>{
                dispatch(modifyPlayer({
                    ...unShiftedPlayers[whose], map: actualPlayer.map, fields: actualPlayer.fields,
                    // ...players[whose], map: actualPlayer.map, fields: actualPlayer.fields,
                    season0Points: actualPlayer.season0Points,
                    season1Points: actualPlayer.season1Points,
                    season2Points: actualPlayer.season2Points,
                    season3Points: actualPlayer.season3Points,
                }))
            },randomTime)
            
            // dispatch(modifyPlayer({ ...players[whose], map: unShiftedPlayers[whose].map, fields: unShiftedPlayers[whose].fields }))
        }

        if (cards.drawnCards[cards.drawnCards.length - 1]?.cardType === "RUIN" && cards.drawnCards[cards.drawnCards.length - 2]?.cardType === "RUIN") {  // HA AZ AKTUÁLIS KÁRTYA ROM -> ÚJ HÚZÁS
            document.getElementById("ruinModal").style.display = "flex";
            const element = document.getElementById("time")
            element.classList.remove("Animate");
            void element.offsetWidth;
            element.classList.add("Animate");

            setTimeout(() => {
                document.getElementById("ruinModal").style.display = "none";
                element.classList.remove("Animate");
                pickCard()
            }, 3000);
        }

        if (cards.drawnCards[cards.drawnCards.length - 1]?.cardType === "RUIN" && cards.drawnCards[cards.drawnCards.length - 2]?.cardType !== "RUIN") {  // HA AZ AKTUÁLIS KÁRTYA ROM -> ÚJ HÚZÁS
            document.getElementById("ruinModal").style.display = "flex";

            const element = document.getElementById("time")
            element.classList.add("Animate");

            setTimeout(() => {

                document.getElementById("ruinModal").style.display = "none";
                element.classList.remove("Animate");
                void element.offsetWidth;

                pickCard()
            }, 3000);
        }

        if (cards.drawnCards[cards.drawnCards.length - 2]?.cardType === "RUIN" && cards.drawnCards[cards.drawnCards.length - 1]?.cardType !== "RUIN" /* || cards.drawnCards.length === 0*/) {  // HA A ROM AZ ELŐZŐ ÉS ARRA KELL ÉPÍTENI
            // LEELLENŐRIZZÜK, HOGY EGYÁLTALÁN VAN E MÉG SZABAD ROM HELY, HA NEM -> SELECTEDBLOCK ÚJ: 1 BLOCK ANY
            // AKKOR IS SELECTEDBLOCK ÚJ: 1 BLOCK ANY, HA A SELECTEDBLOCK NEM FÉR ODA SEHOGY FORGATVA (NA EZ GEC...)

            let canBuildOnRuin = true;

            if (room.roomCode && !actualPlayer.map.includes('1')/* ||  NINCS HELY */) {
                canBuildOnRuin = false;
            }

            if (!canBuildOnRuin) {
                const _blocksAndTypes = FIELD_TYPES.map((fieldType) => {
                    return { type: fieldType, block: "[[1]]" }
                })
                setCanBuildAnywhere(true);
                setBlocksAndTypes(_blocksAndTypes)
            } else {
                setCanBuildAnywhere(false);
            }
        } else {
            setCanBuildAnywhere(true);
        }
    }, [cards.drawnCards])

    const [modifyBlockOnce, setModifyBlockOnce] = useState(0);
    // KELL EGY USEEFFECT ARRA, HOGY HA MÁR VAN BLOCKSANDTYPES, AKKOR ELLENŐRIZZÜK LE AZ ÉPÍTHETŐSÉGET, ÉS AKKOR MANIPULÁLJA A CANBUILDANYWHERET
    useEffect(() => {
        if (cards.drawnCards[cards.drawnCards.length - 2]?.cardType === "RUIN" && cards.drawnCards[cards.drawnCards.length - 1]?.cardType !== "RUIN" /* || cards.drawnCards.length === 0*/) {  // HA A ROM AZ ELŐZŐ ÉS ARRA KELL ÉPÍTENI
            if (modifyBlockOnce === 0) {
                let atLeastOneCanFit = false;   // PESSZIMISTA KERESÉS

                // KIKOMMENTEZVE ELVÁRT MŰKÖDÉS: NEM FÉR ODA EGY RUINHOZ SE TEHÁT EGYESRE VÁLT ÉS AKÁRHOVA RAKHATJA
                let fittingBlocksAndTypes = blocksAndTypes.filter((blockAndType) => {     // csak azok kerülnek a fittingblocksandtypesba amiket le lehet 
                    if (canFitOnRuin(JSON.parse(blockAndType.block))) {                   // helyezni ruinra
                        atLeastOneCanFit = true;
                        return true;
                    } else {
                        return false;
                    }
                })


                if (atLeastOneCanFit) {
                    setBlocksAndTypes(fittingBlocksAndTypes);
                    setModifyBlockOnce(1);
                } else {
                    let _blocksAndTypes = []

                    if (cards.drawnCards[cards.drawnCards.length - 1]?.fieldType1 === "MONSTER") {
                        _blocksAndTypes = [{ type: "MONSTER", block: "[[1]]" }]
                    } else {
                        _blocksAndTypes = FIELD_TYPES.map((fieldType) => {
                            return { type: fieldType, block: "[[1]]" }
                        })
                    }

                    setBlocksAndTypes(_blocksAndTypes)
                    setCanBuildAnywhere(true);
                    setModifyBlockOnce(1);
                }

            } else {
                setModifyBlockOnce(0);
            }
        }
    }, [blocksAndTypes])

    const postGame = async (duration, results, users, messages) => {
        const gameResponse = await axios.post(`api/games`, { duration: duration, results, users, messages }, {
            headers: authHeader()
        });
        return gameResponse;
    }

    const postResult = async (user, points, place) => {
        const resultResponse = await axios.post(`api/users/${user.id}/result`, { user: user.id, points, place }, {
            headers: authHeader()
        });
        return resultResponse;
    }

    const modifyUserPoints = async (user) => {
        await axios.patch(`api/users/${user.id}/points`, { id: user.id, points: user.gamePoints, weekly: user.gamePoints }, {
            headers: authHeader()
        });
    }

    const inBounds = (rowindex, cellindex) => {
        return (
            rowindex >= 0 &&
            cellindex >= 0 &&
            rowindex < JSON.parse(map.blocks).length &&
            cellindex < JSON.parse(map.blocks).length)
    }

    useEffect(() => {
        if (room.gameEnded) {
            // EREDMÉNY MUTATÁSA
            setBlocksAndTypes([]);
            setGameEnd(true);

            if (room.leader.id === actualPlayer.id) {
                const gameEndDate = new Date();
                const gameDuration = Math.round(Math.abs(gameEndDate - gameStartDate) / (60 * 1000))

                const validMessages = messages.filter(message => message.id > 0);

                const orderedArray = players.sort((a, b) => b.gamePoints - a.gamePoints)

                const validPlayers = players.filter(player => player.id > 0);

                let results = [];
                players.forEach(player => {
                    if (player.id > 0) {
                        const place = (orderedArray.findIndex(object => object.id === player.id) + 1)
                        results.push(postResult(player, player.gamePoints, place))

                        modifyUserPoints(player);
                    }
                });

                Promise.all(results).then(
                    (responses) => {
                        const newResults = responses.map(response => response.data)
                        postGame(gameDuration, newResults, validPlayers, validMessages);

                    }
                )

            }
        }
    }, [room])

    const muteUser = (_user) => {
        dispatch(modifyPlayer({ ..._user, muted: !_user.muted }));
    }

    const kickUser = (_user) => {
        dispatch(removePlayer(_user));
    }

    const [reportedUsers, setReportedUsers] = useState([]);

    const reportUser = async (_user) => {
        if (!_user.isGuest && !reportedUsers.some(user => user.id === _user.id)) {
            await axios.patch(`api/users/${_user.id}/report`, {
                headers: authHeader()
            });
            setReportedUsers([...reportedUsers, _user]);
        }
    }

    useEffect(() => {
        if (actualPlayer.kicked) {
            socketApi.leaveRoom(room.roomCode, (ack) => {/*console.log(ack)*/ })
            clearState(null, "/");
        }
    }, [actualPlayer])

    return (
        <div className="Game">

            {map?.blocks &&
                <div className='MapDiv'>
                    <Map selectedBlock={selectedBlock} canBuildAnywhere={canBuildAnywhere} mapPlayer={mapPlayer} />
                </div>
            }
            <div className="DrawnCardDiv">

                <div className="ActualCardDiv">
                    <div className="CardScrollDiv">
                        {cards.drawnCards && cards.drawnCards.length > 0 && cards.drawnCards.map((card, index) => {
                            return (<DrawnCard key={card.id} card={card} index={index} />)
                        })}
                    </div>
                </div>
                <div className="ChooseDiv">
                    <div className="SelectBlockDiv">

                        {blocksAndTypes.map((item, index) => {
                            return (<div key={index} className="BlockDiv" onClick={(e) => { selectBlocks(e, item.type, item.block); setSelectedBlockIndex(index) }}
                                style={{
                                    boxShadow: (selectedBlock.type === item.type &&
                                        selectedBlock.blocks === item.block)
                                        ?
                                        "inset 0 0 4vh 2vh rgba(0, 140, 187, 0.792)" :
                                        ""
                                }}
                            >
                                <Blocks blocks={item.block} type={item.type} />
                            </div>)
                        })}
                    </div>
                    <div className="ControlsDiv">
                        <button className="RotateButton" style={{borderRight: "0.5vh solid black"}}  onClick={(e) => handleUserKeyPress(e,"M")}>Tükrözés</button>
                        <button className="RotateButton" onClick={(e) => handleUserKeyPress(e,"R")}>Forgatás</button>
                    </div>
                </div>
            </div>
            <div className="ContextDiv">
                <div className="DeckDiv">
                    <div className="CardsDiv">
                        <div className="TopCardsDiv">
                            <div className="CardDiv"><img src={require(`../../assets/cards/${actualSeasonCard.picture}`)} className="CardDivImg" onClick={() => { openInspectModal(actualSeasonCard) }} alt={actualSeasonCard.name} /></div>
                            {cards.decreeCards &&
                                cards.decreeCards.map((card) => {
                                    return (<div className="CardDiv" key={card.id}><img src={require(`../../assets/cards//${card.picture}`)} onClick={() => { openInspectModal(card) }} className="CardDivImg" alt={card.name} /></div>)
                                }
                                )
                            }
                        </div>
                        <div className="BottomCardsDiv">
                            <div className="CardDiv"><img src={require(`../../assets/card_back.png`)} className="CardDivImg" alt="kártya háta" /></div>
                            {cards.pointCards &&
                                cards.pointCards.map((card) => {
                                    return (<div className="CardDiv" key={card.id}><img src={require(`../../assets/cards/${card.picture}`)} onClick={() => { openInspectModal(card) }} className="CardDivImg" alt={card.name} /></div>)
                                }
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="PlayersChatDiv">
                    <Chat />
                    <div className="PlayersDiv">
                        <div className="PlayersInfoDiv">
                            {players && players.map((player) => {
                                return (
                                    <div className="PlayerInfo" key={player.id} style={{ backgroundColor: player.id === actualPlayer.id ? "dodgerblue" : "" }}>
                                        <div>{player.name}</div>
                                        <div className="ButtonsDiv">
                                            {player.id !== actualPlayer.id && <img className="MuteKickReportButton" onClick={() => reportUser(player)} src={report} draggable="false" alt="Jelent" />}
                                            {room.leader.id === actualPlayer.id && player.id !== actualPlayer.id &&
                                                <>
                                                    <img className="MuteKickReportButton" onClick={() => muteUser(player)} src={player.muted ? muted : unmuted} draggable="false" alt="Némít" />
                                                    <img className="MuteKickReportButton" onClick={() => kickUser(player)} src={kick} draggable="false" alt="Kitilt" />
                                                </>
                                            }
                                        </div>
                                        <div>{player.gamePoints}</div>
                                    </div>)
                            })}
                        </div>
                        <div className="RoomControlsDiv">
                            <Link onClick={(e) => {
                                if (players.length > 1 && actualPlayer.id === room.leader.id) {
                                    dispatch(updateRoom(players[1]));
                                }
                                dispatch(removePlayer(actualPlayer));
                                socketApi.leaveRoom(room.roomCode, (ack) => {/*console.log(ack)*/ })
                                clearState(e, "/");
                            }}
                            >
                                Kilépés</Link>
                            <Link onClick={(e) => {
                                e.preventDefault();
                                if (actualPlayer.id === room.leader.id && !gameEnd) {
                                    dispatch(endGame());
                                    socketApi.closeRoom(room.roomCode, (ack) => { })
                                }
                                if (gameEnd) { document.getElementById("gameEndModal").style.display = "flex"; }
                            }}
                                style={{
                                    cursor: (actualPlayer.id === room?.leader?.id || gameEnd) ? "pointer" : "not-allowed",
                                    backgroundColor: (actualPlayer.id === room?.leader?.id || gameEnd) ? "" : "#1f1f1f",
                                    color: (actualPlayer.id === room?.leader?.id || gameEnd) ? "" : "#5c5c5c",
                                    boxShadow: (actualPlayer.id === room?.leader?.id || gameEnd) ? "" : "none",
                                    opacity: (actualPlayer.id === room?.leader?.id || gameEnd) ? "1" : "0.7"
                                }}
                            >{gameEnd ? "Eredmények" : "Játék befejezése"}</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}

            {states[currentState] === INIT_DRAWING &&
                <GameModal closable={false} handleCloseModal={handleCloseModal}>
                    <DrawCanvas handleCloseModal={handleCloseModal} />
                </GameModal>
            }

            <InspectModal closable={true} handleCloseModal={handleCloseModal} >
                {inspectedCard &&
                    <img alt={inspectedCard.name} className="InspectModalImg" src={require(`../../assets/cards/${inspectedCard.picture}`)} />
                }
            </InspectModal>

            <WaitingModal />

            <RuinModal />

            {gameEnd && <GameEndModal />}
        </div>
    )
}