import duration from "../../assets/duration.png";
import village from "../../assets/village.png";
import forest from "../../assets/forest.png";
import water from "../../assets/water.png";
import farm from "../../assets/farm.png";
import monster from "../../assets/monster.png";

export default function ExploreCard({ card }) {

    const fieldTypes = { "FOREST": forest, "VILLAGE": village, "FARM": farm, "WATER": water, "MONSTER": monster }

    return (
        <div className="UserCardContext" id="exploreCard">
            <div className="DurationsDiv">
                <div className="DurationsDivCircle">
                    <img src={duration} alt="duration" />
                    <div>{card.duration}</div>
                </div>
            </div>
            <div className="CardNameDiv">{card.name}</div>
            <div className="FieldTypeDiv">
                {card.fieldType1 === "ANY" &&
                    Object.values(fieldTypes).map(type => {
                        return (<img className="FieldTypeImg" id="anyFieldTypeImg" src={type} />)
                    })
                }
                {card.fieldType1 !== "ANY" &&
                    <img className="FieldTypeImg" src={fieldTypes[card.fieldType1]} />
                }
                {card.fieldType2 &&
                    <img className="FieldTypeImg" src={fieldTypes[card.fieldType2]} />
                }
            </div>

            <div className="BlocksDiv">

                <div className="divTable">
                    <div className="divTableBody">
                        {JSON.parse(card.blocks1).map((row, index) => {
                            return (
                                <div key={index} className="divTableRow">
                                    {row.map((cell, index) => {
                                        return (
                                            <div key={index} className="divTableCell" style={{
                                                border: cell === 0 ? "0vh" : "0.1vh solid hsla(32, 15%, 48%, 0.886)",
                                                backgroundColor: cell === 0 ? "" : "#453935"
                                            }}></div>
                                        )
                                    })}
                                </div>
                            )
                        })
                        }
                    </div>
                </div>


                {card.blocks2 && card.blocks2.length > 0 &&
                    <div className="divTable">
                        <div className="divTableBody">
                            {JSON.parse(card.blocks2).map((row, index) => {
                                return (
                                    <div key={index} className="divTableRow">
                                        {row.map((cell, index) => {
                                            return (
                                                <div key={index} className="divTableCell" style={{
                                                    border: cell === 0 ? "0vh" : "0.1vh solid hsla(32, 15%, 48%, 0.886)",
                                                    backgroundColor: cell === 0 ? "" : "#453935"
                                                }}></div>
                                            )
                                        })}
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                }
            </div >
        </div >
    )
}