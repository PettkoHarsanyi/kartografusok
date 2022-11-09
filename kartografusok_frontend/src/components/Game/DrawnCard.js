import ExploreCard from "../Admin/ExploreCard"
import RaidCard from "../Admin/RaidCard"
import RuinCard from "../Admin/RuinCard"
import "../../css/GameCard.css";
import { useSelector } from "react-redux";
import { getCards } from "../../state/cards/selector";
import { useEffect } from "react";

export default function DrawnCard({ card, index }) {
    const cards = useSelector(getCards)
    return (
        <div className="DrawnGameCardDiv" style={{
            marginBottom: ((cards.drawnCards.length/2)-index > 0) ? `${((cards.drawnCards.length/2)-index)*12}vh` : "0vh",
            marginTop: ((cards.drawnCards.length/2)-index < 0) ? `${(index-(cards.drawnCards.length/2))*12}vh` : "0vh",
            zIndex: index
        }}>

            <img src={`api/cards/${card.id}/cardimage`} className="DrawnGameCardDivImg" />

            {
                !card.official &&
                <>
                    {card.cardType === "EXPLORE" && <ExploreCard card={card} />}
                    {card.cardType === "RAID" && <RaidCard card={card} />}
                    {card.cardType === "RUIN" && <RuinCard card={card} />}
                </>
            }
        </div>
    )
}