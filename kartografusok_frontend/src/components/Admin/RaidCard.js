import direction1 from "../../assets/direction1.png";
import directionMinus1 from "../../assets/direction-1.png";


export default function RaidCard({ card }) {
    return (
        <div className="UserCardContext" id="raidCard">
            <div className="CardNameDiv" id="raidName">{card.name}</div>
            <div className="DirAndBlocks">
                <img src={card.direction===1?direction1:directionMinus1} className="directionImg" />
                <div className="divTable">
                    <div className="divTableBody">
                        {JSON.parse(card.blocks1).map((row, index) => {
                            return (
                                <div key={index} className="divTableRow">
                                    {row.map((cell, index) => {
                                        return (
                                            <div key={index} className="divTableCell" id="monsterTableCell" style={{
                                                border: cell === 0 ? "0vh" : "0.1vh solid #885A79",
                                                backgroundColor: cell === 0 ? "" : "#563255"
                                            }}></div>
                                        )
                                    })}
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}