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

    if (item.y -1 >= 0 && map[item.x][item.y-1].value === type){
        neighbors.push(map[item.x][item.y-1])
    }
    if(item.x-1 >= 0 && map[item.x-1][item.y].value === type){
        neighbors.push(map[item.x-1][item.y])
    }
    if (item.x + 1 < map.length && map[item.x + 1][item.y].value === type) {
        neighbors.push(map[item.x + 1][item.y]);
    }
    if (item.y + 1 < map.length && map[item.x][item.y + 1].value === type) {
        neighbors.push(map[item.x][item.y + 1]);
    }

    return neighbors;
}

const neighborsOf = (item,map) => {
    const neighbors = [];
    if(item.x - 1 >= 0){
        neighbors.push({x: item.x-1, y: item.y ,value: map[item.x-1][item.y]});
    }
    if(item.y - 1 >= 0){
        neighbors.push({x: item.x, y: item.y-1 ,value: map[item.x][item.y-1]});
    }
    if(item.x + 1 < map.length){
        neighbors.push({x: item.x+1, y: item.y ,value: map[item.x+1][item.y]});
    }
    if(item.y + 1 < map.length){
        neighbors.push({x: item.x, y: item.y+1 ,value: map[item.x][item.y+1]});
    }
    return neighbors;
}

// 1 - ruin
// 2 - hegy
// 3 - lyuk

const matrix = [
    ["M",  "M",   0,   "V",  "V",  0],
    [0,    "M",  "F",  "V",   0,   0],
    ['M',  "V",  "V",  "V",   0,   0],
    ["W",  "V",  "V",   0,    0,   0],
    [0,     0,    0,   "F",  "M", "M"],
    [0,     0,    0,   "V",  "V", "V"],
];

/*export */
const pointRound = (pointCard1, pointCard2, map) => {

    let point = 0;
    let A = 0;
    let B = 0;

    if (pointCard1.id === 0 || pointCard2.id === 0) {
        console.log("Gazdag síkság")

        let pointsForCard = 0;
        const villageRegions = findIsolated("V", map)
        villageRegions.forEach(region=>{
            const threeDifferent = [];
            region.forEach(village=>{
                neighborsOf(village,map).forEach(neighbor =>{
                    if(neighbor.value !== 0 && neighbor.value !== 1 && neighbor.value !== 3 && neighbor.value !== "V" && !threeDifferent.includes(neighbor.value)){
                        threeDifferent.push(neighbor.value);
                    }
                })
            })
            if (threeDifferent.length >= 3){
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

        const noMountainVillageRegions = villageRegions.filter(region=>
            !region.some(village=>
                neighborsOf(village,map).some(neighbor => neighbor.value === 2)
            )
        )

        pointsForCard = (Math.max(...noMountainVillageRegions.map(region=>region.length)))


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

        map.forEach((row,rowIndex) => {
            row.forEach((cell,cellIndex)=>{
                if(cell === 0){
                    // HA ÜRES MEZŐN VAGYUNK...
                    if((rowIndex-1<0 || (rowIndex-1>=0 && map[rowIndex-1][cellIndex] === 0))    // HA A TÉRKÉP BAL OLDALÁN ÁLL VAGY VAN TŐLE BALRA
                    && (cellIndex-1<0 || (cellIndex-1>=0 && map[rowIndex][cellIndex-1] === 0))    // HA A TÉRKÉP TETEJÉN ÁLL VAGY VAN FELETTE
                    && (rowIndex+1>=map.length || (rowIndex+1<map.length && map[rowIndex+1][cellIndex] === 0))  // HA A TÉRKÉP ALJÁN ÁLL VAGY VAN ALATTA
                    && (cellIndex+1>=map.length || (cellIndex+1<map.length && map[rowIndex][cellIndex+1] === 0))
                    ){
                        pointsForCard=pointsForCard+1;
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
    }

    if (pointCard1.id === 4 || pointCard2.id === 4) {
        console.log("Elveszett birtok")
    }

    if (pointCard1.id === 5 || pointCard2.id === 5) {
        console.log("Töredezett utak")
    }

    if (pointCard1.id === 6 || pointCard2.id === 6) {
        console.log("Kőmelléki erdő")
    }

    if (pointCard1.id === 7 || pointCard2.id === 7) {
        console.log("Partmenti terjeszkedés")
    }

    if (pointCard1.id === 8 || pointCard2.id === 8) {
        console.log("Zöld Gally")
    }

    if (pointCard1.id === 9 || pointCard2.id === 9) {
        console.log("Fatorony")
    }

    if (pointCard1.id === 10 || pointCard2.id === 10) {
        console.log("Az arany magtár")
    }

    if (pointCard1.id === 11 || pointCard2.id === 11) {
        console.log("Faőrszem")
    }

    if (pointCard1.id === 12 || pointCard2.id === 12) {
        console.log("Mágusok völgye")
    }

    if (pointCard1.id === 13 || pointCard2.id === 13) {
        console.log("Csatorna tó")
    }

    if (pointCard1.id === 14 || pointCard2.id === 14) {
        console.log("Vadközösség")
    }

    if (pointCard1.id === 15 || pointCard2.id === 15) {
        console.log("Határvidék")
    }

    point = A + B;

    return { A, B, point };
}

console.log(pointRound({ id: 1 }, { id: 2 },matrix))
// pointRound({ id: 1 }, { id: 2 },matrix)

// console.log(neighborsOf({x:0,y:1},matrix))

// console.log(findIsolated("V", matrix))