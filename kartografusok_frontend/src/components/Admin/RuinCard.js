import ruin from "../../assets/ruin.png";
import ruintype from "../../assets/ruintype.png";

export default function RuinCard({ card }) {
    return (
        <div className="UserCardContext" id="ruinCard">
            <div className="RuinBadgeDiv">
                <div className="RuinDivCircle">
                    <img src={ruin} alt="duration" />
                    <div>{card.duration}</div>
                </div>
            </div>
            <div className="CardNameDiv" id="ruinName">{card.name}</div>
            <div className="RuinFieldType">
                <img src={ruintype} />
            </div>
        </div>
    )
}