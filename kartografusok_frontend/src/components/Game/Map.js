import React, { createRef, useEffect, useState } from 'react';
import scheme from "../../assets/maps/scheme.png"
import empty from "../../assets/maps/empty.png"
import ruin_transparent from "../../assets/maps/ruin_transparent.png"
import gap_transparent from "../../assets/maps/gap_transparent.png"
import mountain_transparent from "../../assets/maps/mountain_transparent.png"
import { useDispatch, useSelector } from 'react-redux';
import { getActualPlayer } from '../../state/actualPlayer/selectors';
import { modifyPlayer } from '../../state/actualPlayer/actions';

export default function Map({ mapTable, selectedBlock, children }) {

    const FieldTypes = {
        Empty: "",
        Ruin: ruin_transparent,
        Mountain: mountain_transparent,
        Gap: gap_transparent,
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

    const actualPlayer = useSelector(getActualPlayer);
    const dispatch = useDispatch();

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

                                            e.target.parentElement.style.backgroundImage = `url('${actualPlayer.fields[getFieldPos(selectedBlock.type)]}')`;
                                            e.target.parentElement.style.borderRadius = "0.5vh";
                                            e.target.parentElement.style.opacity = "0.9";
                                            console.log(selectedBlock);

                                            let newMap = JSON.parse(actualPlayer.map);
                                            JSON.parse(selectedBlock.blocks).forEach((blockRow, blockRowIndex) => {
                                                // console.log(blockRow);
                                                blockRow.forEach((blockCell, blockCellIndex) => {
                                                    console.log((rowindex + blockRowIndex) + " --- " + (cellindex + blockCellIndex));
                                                    // console.log(blockCell);
                                                    if (newMap[rowindex + blockRowIndex][cellindex + blockCellIndex] === 0) {
                                                        newMap[rowindex + blockRowIndex][cellindex + blockCellIndex] = blockCell;
                                                    } else {
                                                        newMap = JSON.parse(actualPlayer.map);
                                                        return;
                                                    }
                                                });
                                            });
                                            // console.log(newMap);
                                            // console.log(JSON.stringify(newMap));
                                            dispatch(modifyPlayer({...actualPlayer, map: JSON.stringify(newMap)}))
                                        }}
                                        style={{ backgroundPosition: "center", backgroundSize: "cover", backgroundImage: `url('${Object.values(FieldTypes)[JSON.parse(actualPlayer.map)[rowindex][cellindex]]}')` }}>
                                        <div className='MapLayer'>
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