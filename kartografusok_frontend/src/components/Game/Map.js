import React, { createRef, useEffect, useState } from 'react';
import scheme from "../../assets/maps/scheme.png"
import empty from "../../assets/maps/empty.png"
import ruin_transparent from "../../assets/maps/ruin_transparent.png"
import gap_transparent from "../../assets/maps/gap_transparent.png"
import mountain_transparent from "../../assets/maps/mountain_transparent.png"
import { useDispatch, useSelector } from 'react-redux';
import { getActualPlayer } from '../../state/actualPlayer/selectors';
import { modifyPlayer } from '../../state/actualPlayer/actions';
import { getCards } from '../../state/cards/selector';

export default function Map({ mapTable, selectedBlock, canBuildAnywhere, children }) {

    const actualPlayer = useSelector(getActualPlayer);
    const cards = useSelector(getCards);
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
                break;
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
                break;
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
            <div className='MapTable'>
                <div className='MapTableBody'>
                    {JSON.parse(actualPlayer.map).map((row, rowindex) =>
                        <div key={rowindex} className='MapTableRow'>
                            {row.map((cell, cellindex) => {
                                return (
                                    <div key={cellindex} className='MapTableCell'
                                        onClick={(e) => {
                                            if (!actualPlayer.isReady) {
                                                let succesful = true;
                                                let newMap = JSON.parse(actualPlayer.map);

                                                let ruinIsUnderBlock = true;  // HA RUIN KÖR VAN, AKKOR A ruinIsUnderBlock-ot FALSERA INICIALIZÁLJUK
                                                if (cards.drawnCards[cards.drawnCards.length - 2]?.cardType === "RUIN" && !canBuildAnywhere) {
                                                    console.log("ITS A RUIN ROUND SO I SET FOUND FALSE, IT SHOULD FIND ONE TO MAKE IT TRUE")
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
                                        <div className='MapLayer' id={`${rowindex},` + `${cellindex}`}
                                            onMouseEnter={(e) => {
                                                if(canBuildAnywhere){
                                                    console.log("I CAN BUILD ANYWHERE BECAUSE THERE IS NO RUIN OR IT CANT FIT OR IS NO RUIN ROUND - ONE BLOCK ANY TYPE");
                                                }else{
                                                    console.log("I CAN'T BUILD ANYWHERE ONLY ON RUIN, BECAUSE THERE IS RUIN AND CAN FIT - ORIGINAL BLOCK");
                                                }
                                                if (!actualPlayer.isReady && selectedBlock.blocks !== '') {
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
                                                                    divsToColorGreen.push(document.getElementById(`${rowindex + blockRowIndex},` + `${cellindex + blockCellIndex}`));

                                                                    if (JSON.parse(actualPlayer.map)[rowindex + blockRowIndex][cellindex + blockCellIndex] === 1 && blockCell === 1) {
                                                                        foundRuinInRuinRound = true;
                                                                    }
                                                                } else {
                                                                    divsToColorGray.push(document.getElementById(`${rowindex + blockRowIndex},` + `${cellindex + blockCellIndex}`));
                                                                }
                                                            }
                                                            else {
                                                                succesful = false;
                                                            }

                                                        });
                                                    });

                                                    if (foundRuinInRuinRound) {
                                                        console.log("I found ruin under the intended blocks");
                                                    } else {
                                                        console.log("I haven't found ruin under the intended blocks");
                                                    }

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
                                                                    divsToColorRed.push(document.getElementById(`${rowindex + blockRowIndex},` + `${cellindex + blockCellIndex}`));
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