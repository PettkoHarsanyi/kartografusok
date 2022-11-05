import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../css/Game.css";
import "../../css/InputRange.css";
import "../../css/Modal.css";
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


export default function Game() {


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
    const navigate = useNavigate();

    const [inspectedCard, setInspectedCard] = useState(null);
    const [actualSeasonCard, setActualSeasonCard] = useState(cards.seasonCards[0]);

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
                            <div className="ControlsDiv"></div>
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
                    <div className="ChatDiv"></div>
                    <div className="PlayersDiv"></div>
                </div>
            </div>

            {/* --- MODALS --- */}
            <GameModal closable={false} handleCloseModal={handleCloseModal} >
                <DrawCanvas handleCloseModal={handleCloseModal} />
            </GameModal>

            <InspectModal closable={true} handleCloseModal={handleCloseModal} >
                {inspectedCard &&
                    <img alt={inspectedCard.name} className="InspectModalImg" src={require(`../../assets/cards/${inspectedCard.picture}`)} />
                }
            </InspectModal>
        </div>
    )
}