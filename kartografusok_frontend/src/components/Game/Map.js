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
import { useEffect } from 'react';
import { useState } from 'react';
import { getPlayers } from '../../state/players/selectors';
import { modifyLocalPlayer } from '../../state/players/actions';
import cross from "../../assets/cross.png"

export default function Map({ selectedBlock, canBuildAnywhere }) {

    const actualPlayer = useSelector(getActualPlayer);
    const players = useSelector(getPlayers);
    const cards = useSelector(getCards);
    const room = useSelector(getRoom);
    const dispatch = useDispatch();
    const [isMonsterRound, setIsMonsterRound] = useState(false);
    const [whose, setWhose] = useState(0);
    const [mapPlayer, setMapPlayer] = useState(actualPlayer);


    useEffect(() => {
        if (cards.drawnCards[cards.drawnCards.length - 1]?.fieldType1 === "MONSTER") {  // HA A SZÖRNY KÖR VAN
            setIsMonsterRound(true);

            const direction = cards.drawnCards[cards.drawnCards.length - 1].direction

            const index = players.findIndex(player => {
                return player.id === actualPlayer.id;
            })

            if (index + direction > players.length - 1) {
                setWhose(0);
            } else if (index + direction < 0) {
                setWhose(players.length - 1);
            } else {
                setWhose(index + direction)
            }
        } else {
            setIsMonsterRound(false);
        }
    }, [cards.drawnCards])

    useEffect(() => {
        let card = cards.drawnCards[cards.drawnCards.length - 1]
        if (card && card.official && card.blocks1 !== null && card.blocks2 !== null) {

            if (card.blocks1 === selectedBlock.blocks) {

            }
        }
    }, [cards.drawnCards])

    let divsToColorGray = []
    let divsToColorGreen = []
    let divsToColorRed = []

    // const [allPoints, setAllPoints] = useState(0);

    // useEffect(() => {
    //     let _allPoints = 0;

    //     if (actualPlayer.season0Points) {
    //         _allPoints = _allPoints + actualPlayer.season0Points.points
    //     } else {
    //         _allPoints = _allPoints
    //     }

    //     if (actualPlayer.season1Points) {
    //         _allPoints = _allPoints + actualPlayer.season1Points.points
    //     } else {
    //         _allPoints = _allPoints
    //     }

    //     if (actualPlayer.season2Points) {
    //         _allPoints = _allPoints + actualPlayer.season2Points.points
    //     } else {
    //         _allPoints = _allPoints
    //     }

    //     if (actualPlayer.season3Points) {
    //         _allPoints = _allPoints + actualPlayer.season3Points.points
    //     } else {
    //         _allPoints = _allPoints
    //     }

    //     setAllPoints(_allPoints);
    // }, [actualPlayer.season0Points, actualPlayer.season1Points, actualPlayer.season2Points, actualPlayer.season3Points])

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

    const neighborsOf = (item, map) => {
        const neighbors = [];
        if (item.x - 1 >= 0) {
            neighbors.push({ x: item.x - 1, y: item.y, value: map[item.x - 1][item.y] });
        }
        if (item.y - 1 >= 0) {
            neighbors.push({ x: item.x, y: item.y - 1, value: map[item.x][item.y - 1] });
        }
        if (item.x + 1 < map.length) {
            neighbors.push({ x: item.x + 1, y: item.y, value: map[item.x + 1][item.y] });
        }
        if (item.y + 1 < map.length) {
            neighbors.push({ x: item.x, y: item.y + 1, value: map[item.x][item.y + 1] });
        }
        return neighbors;
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
                return !isMonsterRound ? actualPlayer.fields[0] : players[whose].fields[0]
            case "F":
                return !isMonsterRound ? actualPlayer.fields[1] : players[whose].fields[1]
            case "W":
                return !isMonsterRound ? actualPlayer.fields[2] : players[whose].fields[2]
            case "A":
                return !isMonsterRound ? actualPlayer.fields[3] : players[whose].fields[3]
            case "M":
                return !isMonsterRound ? actualPlayer.fields[4] : players[whose].fields[4]
            default:
                return ""
        }
    }

    const inBounds = (rowindex, cellindex, blockCellIndex, blockRowIndex) => {
        return (
            rowindex + blockRowIndex < JSON.parse(actualPlayer.map).length &&
            cellindex + blockCellIndex < JSON.parse(actualPlayer.map).length)
    }

    const rotateMatrix = (matrix) => {
        return flipMajorDiagonal(matrix.reverse());
    }

    const flipMajorDiagonal = (matrix) => {
        return matrix[0].map((column, index) => (
            matrix.map(row => row[index])
        ))
    }

    return (
        <>
            <img src={scheme} className="MapPic" alt='Map' />
            <div className='PlayerInfos'>
                <div className='MapName'>{!isMonsterRound ? actualPlayer.name : players[whose].name}</div>
                <div className='MapRank'>{!isMonsterRound ? actualPlayer.division.name : players[whose].division.name}</div>
                <div className='CoinsDiv'>
                    {!isMonsterRound && actualPlayer.allStarsGot > 0 && Array.from({ length: actualPlayer.allStarsGot }, (_, index) => {
                        return <div key={index} className='Coin'><img alt='coin' src={cross} /></div>;
                    })
                    }
                    {isMonsterRound && players[whose].allStarsGot > 0 && Array.from({ length: players[whose].allStarsGot }, (_, index) => {
                        return <div key={index} className='Coin'><img alt='coin' src={cross} /></div>;
                    })
                    }
                </div>
                {!isMonsterRound && actualPlayer.season0Points &&
                    <div className='MapPointDiv'>
                        <div className='MapPointDivLeft'>
                            <div className='PointingSection'>
                                {actualPlayer.season0Points?.A}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season0Points?.B}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season0Points?.stars}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season0Points?.monsters}
                            </div>
                        </div>
                        <div className='MapPointDivRight'>
                            {actualPlayer.season0Points?.points}
                        </div>
                    </div>}
                {!isMonsterRound && actualPlayer.season1Points &&
                    <div className='MapPointDiv' id="firstSeason">
                        <div className='MapPointDivLeft'>
                            <div className='PointingSection'>
                                {actualPlayer.season1Points?.A}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season1Points?.B}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season1Points?.stars}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season1Points?.monsters}
                            </div>
                        </div>
                        <div className='MapPointDivRight'>
                            {actualPlayer.season1Points?.points}
                        </div>
                    </div>}
                {!isMonsterRound && actualPlayer.season2Points &&
                    <div className='MapPointDiv' id="secondSeason">
                        <div className='MapPointDivLeft'>
                            <div className='PointingSection'>
                                {actualPlayer.season2Points?.A}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season2Points?.B}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season2Points?.stars}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season2Points?.monsters}
                            </div>
                        </div>
                        <div className='MapPointDivRight'>
                            {actualPlayer.season2Points?.points}
                        </div>
                    </div>}
                {!isMonsterRound && actualPlayer.season3Points &&
                    <div className='MapPointDiv' id="thirdSeason">
                        <div className='MapPointDivLeft'>
                            <div className='PointingSection'>
                                {actualPlayer.season3Points?.A}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season3Points?.B}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season3Points?.stars}
                            </div>
                            <div className='PointingSection'>
                                {actualPlayer.season3Points?.monsters}
                            </div>
                        </div>
                        <div className='MapPointDivRight'>
                            {actualPlayer.season3Points?.points}
                        </div>
                    </div>}

                {isMonsterRound && players[whose].season0Points &&
                    <div className='MapPointDiv'>
                        <div className='MapPointDivLeft'>
                            <div className='PointingSection'>
                                {players[whose].season0Points?.A}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season0Points?.B}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season0Points?.stars}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season0Points?.monsters}
                            </div>
                        </div>
                        <div className='MapPointDivRight'>
                            {players[whose].season0Points?.points}
                        </div>
                    </div>}
                {isMonsterRound && players[whose].season1Points &&
                    <div className='MapPointDiv' id="firstSeason">
                        <div className='MapPointDivLeft'>
                            <div className='PointingSection'>
                                {players[whose].season1Points?.A}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season1Points?.B}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season1Points?.stars}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season1Points?.monsters}
                            </div>
                        </div>
                        <div className='MapPointDivRight'>
                            {players[whose].season1Points?.points}
                        </div>
                    </div>}
                {isMonsterRound && players[whose].season2Points &&
                    <div className='MapPointDiv' id="secondSeason">
                        <div className='MapPointDivLeft'>
                            <div className='PointingSection'>
                                {players[whose].season2Points?.A}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season2Points?.B}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season2Points?.stars}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season2Points?.monsters}
                            </div>
                        </div>
                        <div className='MapPointDivRight'>
                            {players[whose].season2Points?.points}
                        </div>
                    </div>}
                {isMonsterRound && players[whose].season3Points &&
                    <div className='MapPointDiv' id="thirdSeason">
                        <div className='MapPointDivLeft'>
                            <div className='PointingSection'>
                                {players[whose].season3Points?.A}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season3Points?.B}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season3Points?.stars}
                            </div>
                            <div className='PointingSection'>
                                {players[whose].season3Points?.monsters}
                            </div>
                        </div>
                        <div className='MapPointDivRight'>
                            {players[whose].season3Points?.points}
                        </div>
                    </div>}
                <div className='MapAllPoints'>{
                    !isMonsterRound ?
                        ((actualPlayer.season0Points ? actualPlayer.season0Points.points : 0) + (actualPlayer.season1Points ? actualPlayer.season1Points.points : 0) + (actualPlayer.season2Points ? actualPlayer.season2Points.points : 0) + (actualPlayer.season3Points ? actualPlayer.season3Points.points : 0))
                        :
                        ((players[whose].season0Points ? players[whose].season0Points.points : 0) + (players[whose].season1Points ? players[whose].season1Points.points : 0) + (players[whose].season2Points ? players[whose].season2Points.points : 0) + (players[whose].season3Points ? players[whose].season3Points.points : 0))
                }</div>

            </div>
            <div className='MapTable'>
                <div className='MapTableBody'>
                    {JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map).map((row, rowindex) =>
                        <div key={rowindex} className='MapTableRow'>
                            {row.map((cell, cellindex) => {
                                return (
                                    <div key={cellindex} className='MapTableCell'
                                        onClick={(e) => {
                                            if (!actualPlayer.isReady && !room.gameEnded && cards.drawnCards[cards.drawnCards.length - 1]?.cardType !== "RUIN") {
                                                let succesful = true;
                                                let newMap = JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map);

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

                                                                if (JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map)[rowindex + blockRowIndex][cellindex + blockCellIndex] === 1 && blockCell === 1) {
                                                                    ruinIsUnderBlock = true;
                                                                }
                                                            }
                                                        } else {
                                                            newMap = JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map);
                                                            succesful = false;
                                                        }
                                                    });
                                                });

                                                if (!ruinIsUnderBlock) {
                                                    succesful = false;
                                                }

                                                if (succesful) {

                                                    // Végigmegyünk a selectedblock mezőin
                                                    // Ha valamelyik mezője egy hegymező mellett van
                                                    // AKKOR megnézzük, hogy a hegymező mostmár mindenhol határolt e
                                                    // HA MINDENHOL HATÁROLT, A JÁTÉKOS KAP EGY PONTOT
                                                    // HA NEM HATÁROLT MINDENHOL: SKIP

                                                    // IF MONSTER ROUND!!!!!!!!!!!!!!!
                                                    let player = {}

                                                    if (!isMonsterRound) {
                                                        player = { ...actualPlayer }
                                                    } else {
                                                        player = { ...players[whose] }
                                                    }

                                                    let mountainNeighbors = [];
                                                    JSON.parse(selectedBlock.blocks).forEach((blockRow, blockRowIndex) => {
                                                        blockRow.forEach((blockCell, blockCellIndex) => {
                                                            neighborsOf({ x: rowindex + blockRowIndex, y: cellindex + blockCellIndex }, newMap).forEach((mountainNeighbor => {
                                                                if (mountainNeighbor.value === 2) {
                                                                    if (!neighborsOf({ x: mountainNeighbor.x, y: mountainNeighbor.y }, newMap).some(neighbor => neighbor.value === 0 || neighbor.value === 1)) {
                                                                        // HA BENNE VAN AZ MOUNTAINNEIGHBORSBAN AKKOR NE ADD HOZZÁ
                                                                        // KÜLÖNBEN IGEN
                                                                        if(!mountainNeighbors.some(mountainInArray => mountainInArray.x === mountainNeighbor.x && mountainInArray.y === mountainNeighbor.y)){
                                                                            mountainNeighbors.push(mountainNeighbor);
                                                                        }
                                                                    }
                                                                }
                                                            }))
                                                        });
                                                    });


                                                    player = { ...player, allStarsGot: Math.min(player.allStarsGot + mountainNeighbors.length,14) }



                                                    let rotated90 = JSON.stringify(rotateMatrix(JSON.parse(selectedBlock.blocks)))
                                                    let rotated180 = JSON.stringify(rotateMatrix(JSON.parse(rotated90)))
                                                    let rotated270 = JSON.stringify(rotateMatrix(JSON.parse(rotated180)))
                                                    let card = cards.drawnCards[cards.drawnCards.length - 1]

                                                    if (!isMonsterRound) {
                                                        if (card && card.official && card.blocks1 !== null && card.blocks2 !== null) {
                                                            if (card.blocks1 === selectedBlock.blocks || card.blocks1 === rotated90 || card.blocks1 === rotated180 || card.blocks1 === rotated270) {
                                                                // dispatch(modifyPlayer({ ...actualPlayer, map: JSON.stringify(newMap), isReady: true, allStarsGot: actualPlayer.allStarsGot + 1 }))
                                                                player = { ...player, map: JSON.stringify(newMap), isReady: true, allStarsGot: Math.min(player.allStarsGot + 1,14) }
                                                            } else {
                                                                // dispatch(modifyPlayer({ ...actualPlayer, map: JSON.stringify(newMap), isReady: true }))
                                                                player = { ...player, map: JSON.stringify(newMap), isReady: true }
                                                            }
                                                        } else {
                                                            // dispatch(modifyPlayer({ ...actualPlayer, map: JSON.stringify(newMap), isReady: true }))
                                                            player = { ...player, map: JSON.stringify(newMap), isReady: true }
                                                        }
                                                    } else {
                                                        if (players.length === 1) {

                                                            if (card && card.official && card.blocks1 !== null && card.blocks2 !== null) {
                                                                if (card.blocks1 === selectedBlock.blocks || card.blocks1 === rotated90 || card.blocks1 === rotated180 || card.blocks1 === rotated270) {
                                                                    // dispatch(modifyPlayer({ ...actualPlayer, map: JSON.stringify(newMap), isReady: true, allStarsGot: actualPlayer.allStarsGot + 1 }))
                                                                    player = { ...player, map: JSON.stringify(newMap), isReady: true, allStarsGot: Math.min(player.allStarsGot + 1,14) }
                                                                } else {
                                                                    // dispatch(modifyPlayer({ ...actualPlayer, map: JSON.stringify(newMap), isReady: true }))
                                                                    player = { ...player, map: JSON.stringify(newMap), isReady: true }
                                                                }
                                                            } else {
                                                                // dispatch(modifyPlayer({ ...actualPlayer, map: JSON.stringify(newMap), isReady: true }))
                                                                player = { ...player, map: JSON.stringify(newMap), isReady: true }
                                                            }
                                                        } else {
                                                            // dispatch(modifyPlayer({ ...players[whose], map: JSON.stringify(newMap) }))
                                                            player = { ...player, map: JSON.stringify(newMap) }
                                                        }
                                                    }

                                                    dispatch(modifyPlayer({ ...player }))

                                                    if(isMonsterRound && players.length!==1){
                                                        dispatch(modifyPlayer({ ...actualPlayer, isReady: true }))
                                                    }

                                                    unHover();
                                                }
                                            }
                                        }}
                                        // `url('${Object.values(FieldTypes)[JSON.parse(actualPlayer.map)[rowindex][cellindex]]}')`
                                        style={{
                                            backgroundPosition: "center", backgroundSize: "cover",
                                            borderRadius: (typeof JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map)[rowindex][cellindex] == "number") ? "" : "0.5vh",
                                            opacity: (typeof JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map)[rowindex][cellindex] == "number") ? "1" : "0.8",
                                            backgroundImage: (typeof JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map)[rowindex][cellindex] == "number")
                                                ? `url('${Object.values(FieldTypes)[JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map)[rowindex][cellindex]]}')`
                                                :
                                                `url('${parseToImage(JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map)[rowindex][cellindex])}')`
                                        }}>
                                        <div className='MapLayer' id={`${rowindex},${cellindex}`}
                                            onMouseEnter={(e) => {
                                                if (!actualPlayer.isReady && selectedBlock.blocks !== '' && !room.gameEnded) {
                                                    const map = JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map);
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

                                                                    if (JSON.parse(!isMonsterRound ? actualPlayer.map : players[whose].map)[rowindex + blockRowIndex][cellindex + blockCellIndex] === 1 && blockCell === 1) {
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