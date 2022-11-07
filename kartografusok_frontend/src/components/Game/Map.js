import React, { createRef, useEffect, useState } from 'react';
import scheme from "../../assets/maps/scheme.png"
import empty from "../../assets/maps/empty.png"
import ruin_transparent from "../../assets/maps/ruin_transparent.png"
import gap_transparent from "../../assets/maps/gap_transparent.png"
import mountain_transparent from "../../assets/maps/mountain_transparent.png"
import { useSelector } from 'react-redux';
import { getActualPlayer } from '../../state/actualPlayer/selectors';

export default function Map({ mapTable, children }) {

    const FieldTypes = {
        Empty: "",
        Ruin: ruin_transparent,
        Mountain: mountain_transparent,
        Gap: gap_transparent,
    }

    const actualPlayer = useSelector(getActualPlayer);

    return (
        <>
            <img src={scheme} className="MapPic" alt='Map' />
            <div className='MapTable'>
                <div className='MapTableBody'>
                    {mapTable.map((row, rowindex) =>
                        <div key={rowindex} className='MapTableRow'>
                            {row.map((cell, cellindex) => {
                                return (
                                    <div key={cellindex} className='MapTableCell'
                                        onClick={(e) => {
                                            let newMapTable = [...mapTable];
                                            e.target.parentElement.style.backgroundImage = `url('${actualPlayer.fields[0]}')`;
                                            // newMapTable[rowindex][cellindex] = Object.values(FieldTypes).indexOf(selectedFieldType);
                                            // handleSetMapTable(newMapTable);
                                        }}
                                        style={{ backgroundPosition: "center", backgroundSize: "cover", backgroundImage: `url('${Object.values(FieldTypes)[mapTable[rowindex][cellindex]]}')` }}>
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