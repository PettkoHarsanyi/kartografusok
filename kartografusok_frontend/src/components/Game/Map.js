import React from 'react';
import scheme from "../../assets/maps/scheme.png"
import ruin_transparent from "../../assets/maps/ruin_transparent.png"
import gap_transparent from "../../assets/maps/gap_transparent.png"
import mountain_transparent from "../../assets/maps/mountain_transparent.png"
import { useDispatch, useSelector } from 'react-redux';
import { getActualPlayer } from '../../state/actualPlayer/selectors';
import { modifyPlayer } from '../../state/actualPlayer/actions';
import { getCards } from '../../state/cards/selector';
import { getRoom } from '../../state/room/selectors';

export default function Map({ selectedBlock, canBuildAnywhere, mapPlayer }) {

    const actualPlayer = useSelector(getActualPlayer);
    const cards = useSelector(getCards);
    const room = useSelector(getRoom);
    const dispatch = useDispatch();

    let divsToColorGray = []
    let divsToColorGreen = []
    let divsToColorRed = []

    const FieldTypes = {
        Empty: "",
        Ruin: ruin_transparent,
        Mountain: mountain_transparent,
        Gap: gap_transparent,
    }

    const unHover = () => {
        Array.from(document.getElementsByClassName("MapLayer")).forEach((element) => {
            element.style.backgroundColor = ""
        })
        divsToColorGray = [];
        divsToColorGreen = [];
        divsToColorRed = [];
    }

    const parseToLetter = (_type) => {
        switch (selectedBlock.type) {
            case "VILLAGE":
                return "V"
            case "FOREST":
                return "F"
            case "WATER":
                return "W"
            case "FARM":
                return "A"
            case "MONSTER":
                return "M"
            default:
                return 0
        }
    }

    const parseToImage = (_type) => {
        switch (_type) {
            case "V":
                return actualPlayer.fields[0]
            case "F":
                return actualPlayer.fields[1]
            case "W":
                return actualPlayer.fields[2]
            case "A":
                return actualPlayer.fields[3]
            case "M":
                return actualPlayer.fields[4]
            default:
                return ""
        }
    }

    const inBounds = (rowindex, cellindex, blockCellIndex, blockRowIndex) => {
        return (
            rowindex + blockRowIndex < JSON.parse(actualPlayer.map).length &&
            cellindex + blockCellIndex < JSON.parse(actualPlayer.map).length)
    }

    return (
        <>
            <img src={scheme} className="MapPic" alt='Map' />
            <div className='PlayerInfos'>
                <div className='MapName'>{mapPlayer.name}</div>
                <div className='MapRank'>{mapPlayer.division.name}</div>
                {actualPlayer.season0Points?.points > 0 &&
                    <div className='MapPointDiv'>
                        <div className='MapPointDivLeft'>
                            <div className='PointingSection'>
                                {actualPlayer.season0Points?.A}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season0Points?.B}
                            </div>
                            <div className='PointingSection'>
                                0
                            </div>
                            <div className='PointingSection'>
                                0
                            </div>
                        </div>
                        <div className='MapPointDivRight'>
                            {actualPlayer.season0Points?.points}
                        </div>
                    </div>}
                {actualPlayer.season1Points?.points > 0 && <div className='MapPointDiv' id="firstSeason">
                    <div className='MapPointDivLeft'>
                        <div className='PointingSection'>
                            {actualPlayer.season1Points?.A}
                        </div>
                        <div className='PointingSection'>
                            {actualPlayer.season1Points?.B}
                        </div>
                        <div className='PointingSection'>
                            0
                        </div>
                        <div className='PointingSection'>
                            0
                        </div>
                    </div>
                    <div className='MapPointDivRight'>
                        {actualPlayer.season1Points?.points}
                    </div>
                </div>}
                {actualPlayer.season2Points?.points > 0 && <div className='MapPointDiv' id="secondSeason">
                    <div className='MapPointDivLeft'>
                        <div className='PointingSection'>
                            {actualPlayer.season2Points?.A}
                        </div>
                        <div className='PointingSection'>
                            {actualPlayer.season2Points?.B}
                        </div>
                        <div className='PointingSection'>
                            0
                        </div>
                        <div className='PointingSection'>
                            0
                        </div>
                    </div>
                    <div className='MapPointDivRight'>
                        {actualPlayer.season2Points?.points}
                    </div>
                </div>}
                {actualPlayer.season3Points?.points > 0 && <div className='MapPointDiv' id="thirdSeason">
                    <div className='MapPointDivLeft'>
                        <div className='PointingSection'>
                            {actualPlayer.season3Points?.A}
                        </div>
                        <div className='PointingSection'>
                            {actualPlayer.season3Points?.B}
                        </div>
                        <div className='PointingSection'>
                            0
                        </div>
                        <div className='PointingSection'>
                            0
                        </div>
                    </div>
                    <div className='MapPointDivRight'>
                        {actualPlayer.season3Points?.points}
                    </div>
                </div>}
                <div className='MapAllPoints'>{((actualPlayer.season0Points?.points || 0) + (actualPlayer.season1Points?.points || 0) + (actualPlayer.season2Points?.points || 0) + (actualPlayer.season3Points?.points || 0))}</div>

            </div>
            <div className='MapTable'>
                <div className='MapTableBody'>
                    {JSON.parse(actualPlayer.map).map((row, rowindex) =>
                        <div key={rowindex} className='MapTableRow'>
                            {row.map((cell, cellindex) => {
                                return (
                                    <div key={cellindex} className='MapTableCell'
                                        onClick={(e) => {
                                            if (!actualPlayer.isReady && !room.gameEnded) {
                                                let succesful = true;
                                                let newMap = JSON.parse(actualPlayer.map);

                                                let ruinIsUnderBlock = true;  // HA RUIN KÖR VAN, AKKOR A ruinIsUnderBlock-ot FALSERA INICIALIZÁLJUK
                                                if (cards.drawnCards[cards.drawnCards.length - 2]?.cardType === "RUIN" && !canBuildAnywhere) {
                                                    ruinIsUnderBlock = false;
                                                }

                                                JSON.parse(selectedBlock.blocks).forEach((blockRow, blockRowIndex) => {
                                                    // console.log(blockRow);
                                                    blockRow.forEach((blockCell, blockCellIndex) => {
                                                        // console.log(blockCell);
                                                        if (inBounds(rowindex, cellindex, blockCellIndex, blockRowIndex) && (newMap[rowindex + blockRowIndex][cellindex + blockCellIndex] === 0 ||
                                                            newMap[rowindex + blockRowIndex][cellindex + blockCellIndex] === 1 ||
                                                            blockCell === 0)) {
                                                            if (blockCell === 1) {
                                                                newMap[rowindex + blockRowIndex][cellindex + blockCellIndex] = parseToLetter();

                                                                if (JSON.parse(actualPlayer.map)[rowindex + blockRowIndex][cellindex + blockCellIndex] === 1 && blockCell === 1) {
                                                                    ruinIsUnderBlock = true;
                                                                }
                                                            }
                                                        } else {
                                                            newMap = JSON.parse(actualPlayer.map);
                                                            succesful = false;
                                                        }
                                                    });
                                                });

                                                if (!ruinIsUnderBlock) {
                                                    succesful = false;
                                                }

                                                if (succesful) {
                                                    dispatch(modifyPlayer({ ...actualPlayer, map: JSON.stringify(newMap), isReady: true }))
                                                    unHover();
                                                }
                                            }
                                        }}
                                        // `url('${Object.values(FieldTypes)[JSON.parse(actualPlayer.map)[rowindex][cellindex]]}')`
                                        style={{
                                            backgroundPosition: "center", backgroundSize: "cover",
                                            borderRadius: (typeof JSON.parse(actualPlayer.map)[rowindex][cellindex] == "number") ? "" : "0.5vh",
                                            opacity: (typeof JSON.parse(actualPlayer.map)[rowindex][cellindex] == "number") ? "1" : "0.8",
                                            backgroundImage: (typeof JSON.parse(actualPlayer.map)[rowindex][cellindex] == "number")
                                                ? `url('${Object.values(FieldTypes)[JSON.parse(actualPlayer.map)[rowindex][cellindex]]}')`
                                                :
                                                `url('${parseToImage(JSON.parse(actualPlayer.map)[rowindex][cellindex])}')`
                                        }}>
                                        <div className='MapLayer' id={`${rowindex},${cellindex}`}
                                            onMouseEnter={(e) => {
                                                if (!actualPlayer.isReady && selectedBlock.blocks !== '' && !room.gameEnded) {
                                                    const map = JSON.parse(actualPlayer.map);
                                                    let succesful = true;

                                                    let foundRuinInRuinRound = true;  // HA RUIN KÖR VAN, AKKOR A foundRuinInRuinRound-ot FALSERA INICIALIZÁLJUK
                                                    if (cards.drawnCards[cards.drawnCards.length - 2]?.cardType === "RUIN" && !canBuildAnywhere) {
                                                        foundRuinInRuinRound = false;
                                                    }

                                                    JSON.parse(selectedBlock.blocks).forEach((blockRow, blockRowIndex) => {
                                                        blockRow.forEach((blockCell, blockCellIndex) => {
                                                            if (inBounds(rowindex, cellindex, blockCellIndex, blockRowIndex) && (
                                                                map[rowindex + blockRowIndex][cellindex + blockCellIndex] === 0 ||
                                                                map[rowindex + blockRowIndex][cellindex + blockCellIndex] === 1 ||
                                                                blockCell === 0)) {
                                                                if (blockCell === 1) {
                                                                    divsToColorGreen.push(document.getElementById(`${rowindex + blockRowIndex},${cellindex + blockCellIndex}`));

                                                                    if (JSON.parse(actualPlayer.map)[rowindex + blockRowIndex][cellindex + blockCellIndex] === 1 && blockCell === 1) {
                                                                        foundRuinInRuinRound = true;
                                                                    }
                                                                } else {
                                                                    divsToColorGray.push(document.getElementById(`${rowindex + blockRowIndex},${cellindex + blockCellIndex}`));
                                                                }
                                                            }
                                                            else {
                                                                succesful = false;
                                                            }

                                                        });
                                                    });

                                                    if (!foundRuinInRuinRound) {
                                                        succesful = false;
                                                    }

                                                    if (succesful) {
                                                        divsToColorGreen.forEach(item => {
                                                            item.style.backgroundColor = "rgba(17, 135, 43, 0.7)"
                                                        })
                                                    } else {
                                                        JSON.parse(selectedBlock.blocks).forEach((blockRow, blockRowIndex) => {
                                                            blockRow.forEach((blockCell, blockCellIndex) => {
                                                                if (inBounds(rowindex, cellindex, blockCellIndex, blockRowIndex) && (
                                                                    blockCell === 1)) {
                                                                    divsToColorRed.push(document.getElementById(`${rowindex + blockRowIndex},${cellindex + blockCellIndex}`));
                                                                }
                                                            });
                                                        });

                                                        divsToColorRed = divsToColorRed.concat(divsToColorGreen)
                                                        divsToColorGreen = []
                                                        divsToColorRed.forEach(item => {
                                                            item.style.backgroundColor = "rgba(255, 0, 0, 0.7)"
                                                        })
                                                    }
                                                    divsToColorGray.forEach(item => {
                                                        item.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
                                                    })
                                                }
                                                else {
                                                    unHover();
                                                }
                                            }}

                                            onMouseLeave={(e) => {

                                                unHover();
                                            }}
                                        >
                                        </div>
                                    </div>)
                            }
                            )}
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}