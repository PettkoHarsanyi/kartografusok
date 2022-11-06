import { useEffect, useRef, useState } from "react";
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


export default function Game() {
    const INIT_DRAWING = "INIT_DRAWING";
    const CARD_DRAW = "CARD_DRAW";
    const CARD_PLACE = "CARD_PLACE";

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



    // HA BEMEGY EGY MODIFY PLAYER AKKOR AZ BEMEGY AZ ACTUAL PLAYERBE IS, HA HA MEGEGYEZIK A PLAYERS
    // BELI PLAYER ID-JAVAL.
    // TEHÁT MINDIG CSAK A PLAYERS TÖMBÖN KELL VÁLTOZTATGATNI,
    // AZ ÚGY IS BEÁLLÍTÓDIK AZ ACTUAL PLAYERRE IS. (EZT CSAK LOKÁLISAN KELL)
    // ÖSSZEHASONLÍTÁSNÁL LEHET HASZNÁLNI AZ ACTUALPLAYERT, MERT AZONOS A PLAYERSBELIVEL
    // mindez legalábbis papíron =)

    useEffect(() => {
        if (!room.roomCode) navigate("/");
    }, [])

    const openInspectModal = (card) => {
        setInspectedCard(card);
        document.getElementById("inspectModal").style.display = "flex"
    }



    return (
        <div className="Game">

            {map?.blocks &&
                <div className='MapDiv'>
                    <Map mapTable={JSON.parse(map.blocks)} />
                </div>
            }
            <div className="ContextDiv">
                <div className="DeckDiv">
                    <div className="DrawnCardDiv">
                        <div className="ActualCardDiv"></div>
                        <div className="ChooseDiv">
                            <div className="SelectBlockDiv"></div>
                            <div className="ControlsDiv">
                                <div>Letesz: bal egér gomb</div>
                                <div>Forgatás: jobb egér gomb</div>
                            </div>
                        </div>
                    </div>
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
                            {players && players.map((player)=>{
                                return(<div className="PlayerInfo" style={{backgroundColor: player.id === actualPlayer.id ? "gray":""}}><div>{player.name}</div><div>{player.points}</div>{room.leader.id === actualPlayer.id && player.id !== actualPlayer.id && <div>Némít Kitilt</div>}</div>)
                            })}
                        </div>
                        <div className="RoomControlsDiv">
                            <Link to="/">Kilépés</Link>
                            <Link to="/">Játék befejezése</Link>
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
        </div>
    )
}