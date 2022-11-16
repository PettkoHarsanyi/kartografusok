import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Game.css";
import "../../css/InputRange.css";
import "../../css/Modal.css";
import "../../css/Chat.css";
import { getRoom } from "../../state/room/selectors";
import GameModal from "./DrawModal";
import { containerClasses } from "@mui/system";
import { modifyLocalPlayer, modifyPlayer, setPlayersUnReady } from "../../state/players/actions";
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
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const states = [INIT_DRAWING, CARD_DRAW, CARD_PLACE]
    const [currentState, setCurrentState] = useState(0);

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
    }, [])

    const clearState = (e,to) => {
        e.preventDefault();
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

    const canFitOnRuin = (block) => {
        let canFit = true;

        block.forEach((row,rowIndex)=>{
            row.forEach((cell,cellIndex)=>{
                console.log("Megnézem (" + rowIndex+","+cellIndex+")="+cell+"-tól kezdve");
            })
        })

        return canFit
    }

    const handleUserKeyPress = (event) => {
        setBlocksAndTypes(blocksAndTypes.map((item) => {
            const blocks = JSON.parse(item.block);
            const rotatedBlocks = JSON.stringify(rotateMatrix(blocks));
            return { ...item, block: rotatedBlocks }
        }))
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

    const pickCard = () => {
        if (!gameEnd) {
            if (actualSeasonCard.duration <= duration) {                    // HA AZ ÉVSZAKKÁRTYA <= MINT A JELENLEGI IDŐ SUM
                setActualSeasonCard(cards.seasonCards[seasonIndex + 1]);    // KÖVI ÉVSZAK
                setSeasonIndex(seasonIndex + 1);                            // KÖVI ÉVSZAK INDEX
                if (cards.deck[0]?.duration) {                               // HA KÖVI KÁRTYÁNAK VAN IDEJE
                    setDuration(cards.deck[0].duration)                     // BEÁLLÍTJUK A JELENLEGI IDŐ SUMOT ARRA
                } else {
                    setDuration(0);                                         // KÜLÖNBEN NULLÁRA
                }
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
        // MINDEN JÁTÉKOS VÁLTOZÁSNÁL, AKA BLOCK LERAKÁSNÁL BEVÁRJUK A TÖBBI JÁTÉKOST IS.

        let allReady = true;

        players.forEach(player => {
            if (!player.isReady) {
                allReady = false;       // HA NEM MINDENKI isReady, AKKOR allReady = FALSE
            }
        });

        if (room.roomCode && allReady) {
            pickCard();
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
            console.log("ÉN LEFUTOTTAM");
            const firstDirection = cards.drawnCards[cards.drawnCards.length - 2].direction
            const secondDirection = cards.drawnCards[cards.drawnCards.length - 1].direction

            players.forEach((player, index) => {
                dispatch(modifyPlayer({ ...player, map: players[(Math.abs(index - firstDirection + secondDirection)) % players.length].map, fields: players[(Math.abs(index - firstDirection + secondDirection)) % players.length].fields }))
            })
        }

        if (cards.drawnCards[cards.drawnCards.length - 1]?.fieldType1 === "MONSTER" && cards.drawnCards[cards.drawnCards.length - 2]?.fieldType1 !== "MONSTER") {  // HA A SZÖRNY KÖR VAN
            console.log("ÉN LEFUTOTTAM");
            // ELSHIFTELJÜK A JÁTÉKOSOK MAP-JÁT ÉS FIELDS-JEIT
            const direction = cards.drawnCards[cards.drawnCards.length - 1].direction
            players.forEach((player, index) => {
                dispatch(modifyLocalPlayer({ ...player, map: players[Math.abs((index + direction)) % players.length].map, fields: players[Math.abs((index + direction)) % players.length].fields }))
            })
        }
        if (cards.drawnCards[cards.drawnCards.length - 2]?.fieldType1 === "MONSTER" && cards.drawnCards[cards.drawnCards.length - 1]?.fieldType1 !== "MONSTER") {  // HA VÉGET ÉRT A SZÖRNY KÖR
            console.log("ÉN LEFUTOTTAM");
            // VISSZASHIFTELJÜK A JÁTÉKOSOK MAP-JÁT ÉS FIELDS-JEIT
            const direction = cards.drawnCards[cards.drawnCards.length - 2].direction
            players.forEach((player, index) => {
                dispatch(modifyPlayer({ ...player, map: players[Math.abs((index - direction) % players.length)].map, fields: players[Math.abs((index - direction) % players.length)].fields }))
            })
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

            if (room.roomCode && (!actualPlayer.map.includes('1'))/* ||  NINCS HELY */) {
                canBuildOnRuin = false;
            }

            // let atLeastOneCanFit = false;   // PESSZIMISTA KERESÉS
            // let fittingBlocksAndTypes = blocksAndTypes.filter((blockAndType)=>{     // csak azok kerülnek a fittingblocksandtypesba amiket le lehet 
            //     if(canFitOnRuin(JSON.parse(blockAndType.block))){                   // helyezni ruinra
            //         atLeastOneCanFit = true;
            //         return true;
            //     }
            //     return false;
            // })

            // if(!atLeastOneCanFit){                  // ha az összes false akkor nem tudunk ruinra építeni, ilyenkor bárhova [[1]]-et
            //     canBuildOnRuin = false;
            // }else{
            //     setBlocksAndTypes(fittingBlocksAndTypes);
            // }

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

    useEffect(() => {
        if (seasonIndex === 3 && cards.seasonCards[seasonIndex].duration <= duration) {
            setSeasonIndex(0);
            setGameEnd(true);
        }
    }, [duration])

    return (
        <div className="Game">

            {map?.blocks &&
                <div className='MapDiv'>
                    <Map selectedBlock={selectedBlock} canBuildAnywhere={canBuildAnywhere} />
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
                        <button className="RotateButton" onClick={(e) => handleUserKeyPress(e)}>Forgatás</button>
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
                                return (<div className="PlayerInfo" key={player.id} style={{ backgroundColor: player.id === actualPlayer.id ? "dodgerblue" : "" }}><div>{player.name}</div><div>{player.gamePoints}</div>{room.leader.id === actualPlayer.id && player.id !== actualPlayer.id && <div>Némít Kitilt</div>}</div>)
                            })}
                        </div>
                        <div className="RoomControlsDiv">
                            <Link onClick={(e)=>clearState(e,"/")}>Kilépés</Link>
                            <Link onClick={(e)=>clearState(e,"/")}>Játék befejezése</Link>
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

            <GameEndModal />
        </div>
    )
}