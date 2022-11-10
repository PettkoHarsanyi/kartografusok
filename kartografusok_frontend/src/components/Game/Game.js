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
import { modifyPlayer } from "../../state/players/actions";
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
import { drawCard } from "../../state/cards/drawnCards/actions";
import Card from "../Admin/Card";
import DrawnCard from "./DrawnCard";
import Blocks from "./Blocks";


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
    const [actualSeasonCard, setActualSeasonCard] = useState(cards.seasonCards[0]);
    const [selectedBlock, setSelectedBlock] = useState({ type: "", blocks: "" });

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
            dispatch(drawCard(cards.deck[0]))
        };
    }, [])

    const rotateMatrix = (matrix) => {
        return flipMajorDiagonal(matrix.reverse());
    }

    const flipMajorDiagonal = (matrix) => {
        return matrix[0].map((column, index) => (
            matrix.map(row => row[index])
        ))
    }

    const handleUserKeyPress = (event) => {
            setBlocksAndTypes(blocksAndTypes.map((item)=>{
                const blocks = JSON.parse(item.block);
                const rotatedBlocks = JSON.stringify(rotateMatrix(blocks));
                return {...item, block: rotatedBlocks}
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
        if (cards.drawnCards.length < 1) return;
        const card = cards.drawnCards[cards.drawnCards.length - 1];

        let _blocksAndTypes = [];

        if (card.fieldType1 && card.fieldType1 === "ANY") {
            _blocksAndTypes = 
                FIELD_TYPES.map((fieldType) => {
                    return { type: fieldType, block: card.blocks1 }
                })
        }

        if (card.fieldType1 && card.fieldType1 !== "ANY" && card.blocks1) {
            _blocksAndTypes = [
                ..._blocksAndTypes,
                { type: card.fieldType1, block: card.blocks1 }
            ]
        }

        if (card.fieldType1 && card.fieldType1 !== "ANY" && card.blocks2) {
            _blocksAndTypes = [
                ..._blocksAndTypes,
                { type: card.fieldType1, block: card.blocks2 }
            ]
        }

        if (card.fieldType2 && card.fieldType1 !== "ANY" && card.blocks1) {
            _blocksAndTypes = [
                ..._blocksAndTypes,
                { type: card.fieldType2, block: card.blocks1 }
            ]
        }

        if (card.fieldType2 && card.fieldType1 !== "ANY" && card.blocks2) {
            _blocksAndTypes = [
                ..._blocksAndTypes,
                { type: card.fieldType2, block: card.blocks2 }
            ]
        }

        setBlocksAndTypes(_blocksAndTypes);
    }, [cards.drawnCards])

    const [selectedBlockIndex,setSelectedBlockIndex] = useState(0);

    useEffect(()=>{
        setSelectedBlockIndex(0);
    },[cards.drawnCards])

    useEffect(()=>{
        setSelectedBlock({type:blocksAndTypes[selectedBlockIndex]?.type??"",blocks:blocksAndTypes[selectedBlockIndex]?.block??""})
    },[blocksAndTypes])

    return (
        <div className="Game">

            {map?.blocks &&
                <div className='MapDiv'>
                    <Map mapTable={JSON.parse(map.blocks)} />
                </div>
            }
            <div className="DrawnCardDiv">

                <div className="ActualCardDiv">
                    <div className="CardScrollDiv">
                        {cards.drawnCards && cards.drawnCards.map((card, index) => {
                            return (<DrawnCard key={card.id} card={card} index={index} />)
                        })}
                    </div>
                </div>
                <div className="ChooseDiv">
                    <div className="SelectBlockDiv">

                        {blocksAndTypes.map((item,index) => {
                            console.log(item);
                            return(<div key={index} className="BlockDiv" onClick={(e) => { selectBlocks(e, item.type, item.block); setSelectedBlockIndex(index) }}
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

                        {/* HA BÁRMILYEN */}
                        {/* {cards.drawnCards && cards.drawnCards.length > 0 && cards.drawnCards[cards.drawnCards.length - 1].fieldType1 &&
                            cards.drawnCards[cards.drawnCards.length - 1].fieldType1 === "ANY" &&
                            FIELD_TYPES.map((type, index) => {
                                return (
                                    <div key={index} className="BlockDiv" onClick={(e) => { selectBlocks(e, type, cards.drawnCards[cards.drawnCards.length - 1].blocks1) }}
                                        style={{
                                            boxShadow: (selectedBlock.type === type &&
                                                selectedBlock.blocks === cards.drawnCards[cards.drawnCards.length - 1].blocks1)
                                                ?
                                                "inset 0 0 4vh 2vh rgba(0, 140, 187, 0.792)" :
                                                ""
                                        }}
                                    >
                                        <Blocks blocks={cards.drawnCards[cards.drawnCards.length - 1].blocks1} type={type} />
                                    </div>
                                )
                            })
                            // <div>{cards.drawnCards[cards.drawnCards.length - 1].fieldType1}</div>
                        } */}

                        {/* HA VAN ELSŐ FÖLDTÍPUS - ELSŐ BLOCK KIRAJZOLÁSA */}
                        {/* {cards.drawnCards && cards.drawnCards.length > 0 && cards.drawnCards[cards.drawnCards.length - 1].fieldType1 &&
                            cards.drawnCards[cards.drawnCards.length - 1].fieldType1 !== "ANY" && cards.drawnCards[cards.drawnCards.length - 1].blocks1 &&
                            <div className="BlockDiv" onClick={(e) => { selectBlocks(e, cards.drawnCards[cards.drawnCards.length - 1].fieldType1, cards.drawnCards[cards.drawnCards.length - 1].blocks1) }}
                                style={{
                                    boxShadow: (selectedBlock.type === cards.drawnCards[cards.drawnCards.length - 1].fieldType1 &&
                                        selectedBlock.blocks === cards.drawnCards[cards.drawnCards.length - 1].blocks1)
                                        ?
                                        "inset 0 0 4vh 2vh rgba(0, 140, 187, 0.792)" :
                                        ""
                                }}
                            >
                                <Blocks blocks={cards.drawnCards[cards.drawnCards.length - 1].blocks1} type={cards.drawnCards[cards.drawnCards.length - 1].fieldType1} />
                            </div>
                        } */}

                        {/* HA VAN ELSŐ FÖLDTÍPUS - MÁSODIK BLOCK KIRAJZOLÁSA */}
                        {/* {cards.drawnCards && cards.drawnCards.length > 0 && cards.drawnCards[cards.drawnCards.length - 1].fieldType1 &&
                            cards.drawnCards[cards.drawnCards.length - 1].fieldType1 !== "ANY" && cards.drawnCards[cards.drawnCards.length - 1].blocks2 &&
                            <div className="BlockDiv" onClick={(e) => { selectBlocks(e, cards.drawnCards[cards.drawnCards.length - 1].fieldType1, cards.drawnCards[cards.drawnCards.length - 1].blocks2) }}
                                style={{
                                    boxShadow: (selectedBlock.type === cards.drawnCards[cards.drawnCards.length - 1].fieldType1 &&
                                        selectedBlock.blocks === cards.drawnCards[cards.drawnCards.length - 1].blocks2)
                                        ?
                                        "inset 0 0 4vh 2vh rgba(0, 140, 187, 0.792)" :
                                        ""
                                }}
                            >
                                <Blocks blocks={cards.drawnCards[cards.drawnCards.length - 1].blocks2} type={cards.drawnCards[cards.drawnCards.length - 1].fieldType1} />
                            </div>
                        } */}

                        {/* HA VAN MÁSODIK FÖLDTÍPUS - ELSŐ BLOCK KIRAJZOLÁSA */}
                        {/* {cards.drawnCards && cards.drawnCards.length > 0 && cards.drawnCards[cards.drawnCards.length - 1].fieldType2 &&
                            cards.drawnCards[cards.drawnCards.length - 1].fieldType1 !== "ANY" && cards.drawnCards[cards.drawnCards.length - 1].blocks1 &&
                            <div className="BlockDiv" onClick={(e) => { selectBlocks(e, cards.drawnCards[cards.drawnCards.length - 1].fieldType2, cards.drawnCards[cards.drawnCards.length - 1].blocks1) }}
                                style={{
                                    boxShadow: (selectedBlock.type === cards.drawnCards[cards.drawnCards.length - 1].fieldType2 &&
                                        selectedBlock.blocks === cards.drawnCards[cards.drawnCards.length - 1].blocks1)
                                        ?
                                        "inset 0 0 4vh 2vh rgba(0, 140, 187, 0.792)" :
                                        ""
                                }}
                            >
                                <Blocks blocks={cards.drawnCards[cards.drawnCards.length - 1].blocks1} type={cards.drawnCards[cards.drawnCards.length - 1].fieldType2} />
                            </div>
                        } */}

                        {/* HA VAN MÁSODIK FÖLDTÍPUS - MÁSODIK BLOCK KIRAJZOLÁSA */}
                        {/* {cards.drawnCards && cards.drawnCards.length > 0 && cards.drawnCards[cards.drawnCards.length - 1].fieldType2 &&
                            cards.drawnCards[cards.drawnCards.length - 1].fieldType1 !== "ANY" && cards.drawnCards[cards.drawnCards.length - 1].blocks2 &&
                            <div className="BlockDiv" onClick={(e) => { selectBlocks(e, cards.drawnCards[cards.drawnCards.length - 1].fieldType2, cards.drawnCards[cards.drawnCards.length - 1].blocks2) }}
                                style={{
                                    boxShadow: (selectedBlock.type === cards.drawnCards[cards.drawnCards.length - 1].fieldType2 &&
                                        selectedBlock.blocks === cards.drawnCards[cards.drawnCards.length - 1].blocks2)
                                        ?
                                        "inset 0 0 4vh 2vh rgba(0, 140, 187, 0.792)" :
                                        ""
                                }}
                            >
                                <Blocks blocks={cards.drawnCards[cards.drawnCards.length - 1].blocks2} type={cards.drawnCards[cards.drawnCards.length - 1].fieldType2} />
                            </div>
                        } */}

                    </div>
                    <div className="ControlsDiv">
                        <button onClick={(e) => handleUserKeyPress(e)}>Forgatás</button>
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
                                return (<div className="PlayerInfo" key={player.id} style={{ backgroundColor: player.id === actualPlayer.id ? "gray" : "" }}><div>{player.name}</div><div>{player.points}</div>{room.leader.id === actualPlayer.id && player.id !== actualPlayer.id && <div>Némít Kitilt</div>}</div>)
                            })}
                            <button onClick={(e) => {
                                e.preventDefault();
                                dispatch(drawCard(cards.deck[0]))
                            }}>Húz</button>
                        </div>
                        <div className="RoomControlsDiv">
                            <Link to="/">Kilépés</Link>
                            <Link to="/">Játék befejezése</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* {states[currentState] === INIT_DRAWING &&
                <GameModal closable={false} handleCloseModal={handleCloseModal}>
                    <DrawCanvas handleCloseModal={handleCloseModal} />
                </GameModal>
            } */}

            <InspectModal closable={true} handleCloseModal={handleCloseModal} >
                {inspectedCard &&
                    <img alt={inspectedCard.name} className="InspectModalImg" src={require(`../../assets/cards/${inspectedCard.picture}`)} />
                }
            </InspectModal>
        </div>
    )
}