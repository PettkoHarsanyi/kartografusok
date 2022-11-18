import { useEffect } from "react";
import { useSelector } from "react-redux";
import "../../css/Blocks.css";
import { getActualPlayer } from "../../state/actualPlayer/selectors";

export default function Blocks({ blocks, type }) {
    const getFieldPos = (_type) => {
        switch (_type) {
            case "VILLAGE":
                return 0
            case "FOREST":
                return 1
            case "WATER":
                return 2
            case "FARM":
                return 3
            case "MONSTER":
                return 4
            default:
                return 0
                break;
        }
    }
    const actualPlayer = useSelector(getActualPlayer);

    return (
        <div className="BlocksTable">
            <div className="BlocksTableBody">
                {JSON.parse(blocks).map((row, index) => {
                    return (
                        <div key={index} className="BlocksTableRow">
                            {row.map((cell, index) => {
                                return (
                                    <div key={index} className="BlocksTableCell" style={{
                                        border: cell === 0 ? "0vh" : "0.1vh solid hsla(32, 15%, 48%, 0.886)",
                                        backgroundColor: cell === 0 ? "" : "#453935",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundImage: cell === 0 ? "" : `url('${actualPlayer.fields[getFieldPos(type)]}')`
                                    }}></div>
                                )
                            })}
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}