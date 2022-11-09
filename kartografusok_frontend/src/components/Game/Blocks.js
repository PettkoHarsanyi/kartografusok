import "../../css/Blocks.css";

export default function Blocks({ blocks, type }) {
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
    )
}