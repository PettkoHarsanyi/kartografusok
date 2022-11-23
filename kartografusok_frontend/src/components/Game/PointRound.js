const findIsolated = (type, _map) => {
    const map = JSON.parse(JSON.stringify(_map));
    map.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            map[rowIndex][cellIndex] = { value: cell, x: rowIndex, y: cellIndex, visited: false }
        })
    })

    const isolatedsOfType = [];
    map.flat().forEach(element => {
        if (element.value === type && !element.visited) {
            let separateArrays = [];
            traverse(element, type, map, separateArrays);
            isolatedsOfType.push(separateArrays);
        }
    })

    return isolatedsOfType;
}

const traverse = (item, type, map, separateArrays) => {
    map[item.x][item.y].visited = true;
    separateArrays.push({ x: item.x, y: item.y });
    traverseNeighbors(item, type, map).forEach(neighbor => {
        if (!neighbor.visited) {
            traverse(neighbor, type, map, separateArrays);
        }
    })
}

const traverseNeighbors = (item, type, map) => {
    const neighbors = [];

    if (item.y - 1 >= 0 && map[item.x][item.y - 1].value === type) {
        neighbors.push(map[item.x][item.y - 1])
    }
    if (item.x - 1 >= 0 && map[item.x - 1][item.y].value === type) {
        neighbors.push(map[item.x - 1][item.y])
    }
    if (item.x + 1 < map.length && map[item.x + 1][item.y].value === type) {
        neighbors.push(map[item.x + 1][item.y]);
    }
    if (item.y + 1 < map.length && map[item.x][item.y + 1].value === type) {
        neighbors.push(map[item.x][item.y + 1]);
    }

    return neighbors;
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

const isFullField = (field) => {
    return isNaN(field) || field === 2;
}

// 1 - ruin
// 2 - hegy
// 3 - lyuk

// const matrix = [
//     ["M", "M", 0, "V", "V", 0],
//     [0, "M", "F", "V", 0, 0],
//     ['M', "V", "V", "V", 0, 0],
//     ["W", "V", "V", 0, 0, 0],
//     [0, 0, 0, "F", "M", "M"],
//     ["V", 0, 0, "V", "V", "V"],
// ];

// const matrix = [
//     [["V", "W",  0,  0,  0,   0,  "V", "V", 0, 0, 0],
//     ["V",  "W",  0,  0, "V", "V", "V",  0,  2, 0, 0],
//     ["V",  "W",  1,  2,  0,   0,   0,   0,  0, 0, 0],
//     ["V",   0,   0,  0,  0,   3,   0,   0,  0, 0, 0],
//     ["A",   0,   0,  0,  3,   3,   1,   0,  0, 0, 0],
//     ["A",   0,   0,  0,  3,   3,   3,   0,  0, 0, 0],
//     ["A",  "A", "A", 0,  0,   3,   0,   0,  0, 0, 0],
//     ["A",   0,   0,  0,  0,   2,   0,   0,  1, 0, 0],
//     ["A",   0,   0,  0,  0,   0,   0,   0,  0, 2, 0],
//     ["F",   0,   2, "M", 0,   0,   0,   0,  0, 0, 0],
//     ["F",  "F",  0,  0,  0,   0,   0,   0,  0, 0, 0]]
// ];

// const originalMatrix = [
//     [["V", "W", 0, 0, 0, 0, "V", "V", 0, 0, 0],
//     ["V",  "W", 0, 0, "V", "V", "V", 0, 2, 0, 0],
//     ["V",  "W", 1, 2, 0, 0, 0, 0, 0, 0, 0],
//     ["V",   0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
//     ["A",   0, 0, 0, 3, 3, 1, 0, 0, 0, 0],
//     ["A",   0, 0, 0, 3, 3, 3, 0, 0, 0, 0],
//     ["A",  "A", "A", 0, 0, 3, 0, 0, 0, 0, 0],
//     ["A",   0, 0, 0, 0, 2, 0, 0, 1, 0, 0],
//     ["A",   0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
//     ["F",   0, 2, "M", 0, 0, 0, 0, 0, 0, 0],
//     ["F",  "F", 0, 0, 0, 0, 0, 0, 0, 0, 0]]
// ];

// CELL-NÉL VAGYUNK (0,0)
// 
// for i (cell.y+i || cell.x+i ||  cell.x+i cell.y+i ) VALAMELYIK 0-E
// HA IGEN AKKOR i LESZ A NAGYSÁG

export const pointRound = (pointCard1, pointCard2, map, originalMap) => {

    let point = 0;
    let A = 0;
    let B = 0;

    if (pointCard1.id === 0 || pointCard2.id === 0) {
        console.log("Gazdag síkság")

        let pointsForCard = 0;
        const villageRegions = findIsolated("V", map)
        villageRegions.forEach(region => {
            const threeDifferent = [];
            region.forEach(village => {
                neighborsOf(village, map).forEach(neighbor => {
                    if (neighbor.value !== 0 && neighbor.value !== 1 && neighbor.value !== 3 && neighbor.value !== "V" && !threeDifferent.includes(neighbor.value)) {
                        threeDifferent.push(neighbor.value);
                    }
                })
            })
            if (threeDifferent.length >= 3) {
                pointsForCard = pointsForCard + 3;
            }
        })

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 0 && pointCard2.id !== 0) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 0 && pointCard2.id === 0) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 1 || pointCard2.id === 1) {
        console.log("Nagyváros")

        let pointsForCard = 0;
        const villageRegions = findIsolated("V", map)
        // console.log(villageRegions);

        const noMountainVillageRegions = villageRegions.filter(region =>
            !region.some(village =>
                neighborsOf(village, map).some(neighbor => neighbor.value === 2)
            )
        )

        pointsForCard = (Math.max(...noMountainVillageRegions.map(region => region.length)))


        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 1 && pointCard2.id !== 1) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 1 && pointCard2.id === 1) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 2 || pointCard2.id === 2) {
        console.log("Üstvidék")

        let pointsForCard = 0;

        map.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell === 0) {
                    // HA ÜRES MEZŐN VAGYUNK...
                    if ((rowIndex - 1 < 0 || (rowIndex - 1 >= 0 && isFullField(map[rowIndex - 1][cellIndex])))    // HA A TÉRKÉP BAL OLDALÁN ÁLL VAGY VAN TŐLE BALRA
                        && (cellIndex - 1 < 0 || (cellIndex - 1 >= 0 && isFullField(map[rowIndex][cellIndex - 1])))    // HA A TÉRKÉP TETEJÉN ÁLL VAGY VAN FELETTE
                        && (rowIndex + 1 >= map.length || (rowIndex + 1 < map.length && isFullField(map[rowIndex + 1][cellIndex])))  // HA A TÉRKÉP ALJÁN ÁLL VAGY VAN ALATTA
                        && (cellIndex + 1 >= map.length || (cellIndex + 1 < map.length && isFullField(map[rowIndex][cellIndex + 1])))
                    ) {
                        pointsForCard = pointsForCard + 1;
                    }
                }
            })
        })

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 2 && pointCard2.id !== 2) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 2 && pointCard2.id === 2) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 3 || pointCard2.id === 3) {
        console.log("Pajzsfal")

        let pointsForCard = 0;

        const villageRegions = findIsolated("V", map)
        // console.log(villageRegions);

        const sortedvillageRegions = villageRegions.sort((a, b) => b.length - a.length);

        if (sortedvillageRegions.length === 1) {
            pointsForCard = sortedvillageRegions[0].length * 2
        }

        if (sortedvillageRegions.length > 1) {
            pointsForCard = sortedvillageRegions[1].length * 2
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 3 && pointCard2.id !== 3) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 3 && pointCard2.id === 3) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 4 || pointCard2.id === 4) {
        console.log("Elveszett birtok")

        let pointsForCard = 0;

        let max = 0;
        map.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell !== 0) {
                    let i = 0;

                    let l = true;

                    while ((rowIndex + i < map.length) && (cellIndex + i < map.length) && isFullField(map[rowIndex + i][cellIndex + i]) && isFullField(map[rowIndex + i][cellIndex]) && isFullField(map[rowIndex][cellIndex + i]) && l) {
                        for (let j = 0; j < i; j++) {
                            l = l && isFullField(map[rowIndex + (i)][cellIndex + j]) && isFullField(map[rowIndex + j][cellIndex + (i)])
                        }
                        if (l) i++;
                    }

                    if (i > max) {
                        max = i
                    }
                }
            })
        })

        pointsForCard = max * 3;

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 4 && pointCard2.id !== 4) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 4 && pointCard2.id === 4) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 5 || pointCard2.id === 5) {
        console.log("Töredezett utak")

        let pointsForCard = 0;

        for (let i = 0; i < map.length; i++) {
            let cell = map[i][0];

            if (isFullField(cell)) {
                let diag = 0;
                let successful = true;
                let over = i + 1 === map.length;
                while (isFullField(cell) && successful && !over) {
                    diag++;
                    cell = map[i + diag][diag];
                    successful = isFullField(cell);
                    over = i + diag === (map.length - 1)
                }

                if (successful) {
                    pointsForCard += 3;
                }
            }
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 5 && pointCard2.id !== 5) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 5 && pointCard2.id === 5) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 6 || pointCard2.id === 6) {
        console.log("Kőmelléki erdő")

        let pointsForCard = 0;

        const forestRegions = findIsolated("F", map);

        const mountainNeighbords = [];

        forestRegions.forEach(region => {
            region.forEach(forest => {
                neighborsOf(forest, map).forEach(neighbor => {
                    if (neighbor.value === 2 && !mountainNeighbords.some(element => element.x === neighbor.x && element.y === neighbor.y)) {
                        mountainNeighbords.push(neighbor);
                    }
                })
            })
        })

        if (mountainNeighbords.length > 1) {
            pointsForCard = mountainNeighbords.length * 3;
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 6 && pointCard2.id !== 6) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 6 && pointCard2.id === 6) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 7 || pointCard2.id === 7) {
        console.log("Partmenti terjeszkedés")

        let pointsForCard = 0;

        const farmRegions = findIsolated("A", map);
        const waterRegions = findIsolated("W", map);

        const filteredFarmRegions = farmRegions.filter(region => !region.some(farm => farm.x === 0 || farm.y === 0 || farm.x === map.length - 1 || farm.y === map.length - 1 || neighborsOf(farm, map).some(neighbor => neighbor.value === "W")))
        const filteredWaterRegions = waterRegions.filter(region => !region.some(water => water.x === 0 || water.y === 0 || water.x === map.length - 1 || water.y === map.length - 1 || neighborsOf(water, map).some(neighbor => neighbor.value === "A")))

        pointsForCard = filteredFarmRegions.length * 3 + filteredWaterRegions.length * 3;

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 7 && pointCard2.id !== 7) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 7 && pointCard2.id === 7) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 8 || pointCard2.id === 8) {
        console.log("Zöld Gally")

        let pointsForCard = 0;

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map.length; j++) {
                if (map[i][j] === "F") {
                    pointsForCard++;
                    break;
                }
            }

            for (let j = 0; j < map.length; j++) {
                if (map[j][i] === "F") {
                    pointsForCard++;
                    break;
                }
            }
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 8 && pointCard2.id !== 8) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 8 && pointCard2.id === 8) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 9 || pointCard2.id === 9) {
        console.log("Fatorony")

        let pointsForCard = 0;

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map.length; j++) {
                let cell = map[i][j];
                if (cell === "F") {
                    if (
                        (i === 0 || (i !== 0 && isFullField(map[i - 1][j]))) &&
                        (i === (map.length - 1) || (i !== (map.length - 1) && isFullField(map[i + 1][j]))) &&
                        (j === 0 || (j !== 0 && isFullField(map[i][j - 1]))) &&
                        (j === (map.length - 1) || (j !== (map.length - 1) && isFullField(map[i][j + 1])))
                    ) {
                        pointsForCard++;
                    }
                }
            }
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 9 && pointCard2.id !== 9) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 9 && pointCard2.id === 9) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 10 || pointCard2.id === 10) {
        console.log("Az arany magtár")

        let pointsForCard = 0;

        for (let i = 0; i < originalMap.length; i++) {
            for (let j = 0; j < originalMap.length; j++) {
                let cell = originalMap[i][j];

                if (cell === 1) {

                    neighborsOf({ x: i, y: j }, map).forEach(neighbor => {
                        if (neighbor.value === "W") {
                            pointsForCard++;
                        }
                    })

                    if (map[i][j] === "A") {
                        pointsForCard += 3;
                    }
                }
            }
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 10 && pointCard2.id !== 10) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 10 && pointCard2.id === 10) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 11 || pointCard2.id === 11) {
        console.log("Faőrszem")

        let pointsForCard = 0;

        for (let i = 0; i < map.length; i++) {
            if (map[0][i] === "F") pointsForCard++;
            if (map[map.length - 1][i] === "F") pointsForCard++;
        }

        for (let i = 1; i < map.length - 1; i++) {
            if (map[i][0] === "F") pointsForCard++;
            if (map[i][map.length - 1] === "F") pointsForCard++;
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 11 && pointCard2.id !== 11) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 11 && pointCard2.id === 11) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 12 || pointCard2.id === 12) {
        console.log("Mágusok völgye")

        let pointsForCard = 0;

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map.length; j++) {
                let cell = map[i][j];

                if (cell === 2) {
                    neighborsOf({ x: i, y: j }, map).forEach(neighbor => {
                        if (neighbor.value === "W") {
                            pointsForCard += 2;
                        }
                        if (neighbor.value === "A") {
                            pointsForCard++;
                        }
                    })
                }
            }
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 12 && pointCard2.id !== 12) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 12 && pointCard2.id === 12) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 13 || pointCard2.id === 13) {
        console.log("Csatorna tó")

        let pointsForCard = 0;

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map.length; j++) {
                let cell = map[i][j];

                if (cell === "W") {
                    let farmNeighborsCounted = 0;
                    neighborsOf({ x: i, y: j }, map).forEach(neighbor => {
                        if (neighbor.value === "A" && farmNeighborsCounted === 0) {
                            farmNeighborsCounted++;
                            pointsForCard++;

                        }
                    })
                }

                if (cell === "A") {
                    let waterNeighborsCounted = 0;
                    neighborsOf({ x: i, y: j }, map).forEach(neighbor => {
                        if (neighbor.value === "W" && waterNeighborsCounted === 0) {
                            waterNeighborsCounted++;
                            pointsForCard++;
                        }
                    })
                }
            }
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 13 && pointCard2.id !== 13) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 13 && pointCard2.id === 13) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 14 || pointCard2.id === 14) {
        console.log("Vadközösség")

        let pointsForCard = 0;

        const villageRegions = findIsolated("V", map);

        villageRegions.forEach(region => {
            if (region.length >= 6) {
                pointsForCard += 8;
            }
        })

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 14 && pointCard2.id !== 14) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 14 && pointCard2.id === 14) {
            B = B + pointsForCard;
        }
    }

    if (pointCard1.id === 15 || pointCard2.id === 15) {
        console.log("Határvidék")

        let pointsForCard = 0;

        for (let i = 0; i < map.length; i++) {
            let fullFilledX = true;
            let fullFilledY = true;
            for (let j = 0; j < map.length; j++) {
                fullFilledX = fullFilledX && isFullField(map[i][j])
                fullFilledY = fullFilledY && isFullField(map[j][i])
            }
            if (fullFilledX) { pointsForCard += 6 }
            if (fullFilledY) { pointsForCard += 6 }
        }

        // EZ A KÁRTYA "A" ÉVSZAK VOLT
        if (pointCard1.id === 15 && pointCard2.id !== 15) {
            A = A + pointsForCard;
        }

        // EZ A KÁRTYA "B" ÉVSZAK VOLT
        if (pointCard1.id !== 15 && pointCard2.id === 15) {
            B = B + pointsForCard;
        }
    }

    point = A + B;

    return { A, B, point };
}

// console.log(
//     pointRound({ id: 2 }, { id: 0 }, matrix, originalMatrix)
// )