const findIsolated = (type, map) => {
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
    item = { ...item, visited: true }
    map[item.x][item.y].visited = true;
    separateArrays.push({ x: item.x, y: item.y }); // ITT LEFILTEREZEM AZ ATTRBOKAT, (ha csak item => minden)
    neighborsOf(item, type, map).forEach(neighbor => {
        if (!neighbor.visited) {
            traverse(neighbor, type, map, separateArrays);
        }
    })
}

const neighborsOf = (item, type, map) => {
    const neighbors = [];
    if (item.y - 1 >= 0 && map[item.x][item.y - 1].value === type) {
        neighbors.push(map[item.x][item.y - 1]);
    }
    if (item.x - 1 >= 0 && map[item.x - 1][item.y].value === type) {
        neighbors.push(map[item.x - 1][item.y]);
    }
    if (item.x + 1 < map.length && map[item.x + 1][item.y].value === type) {
        neighbors.push(map[item.x + 1][item.y]);
    }
    if (item.y + 1 < map.length && map[item.x][item.y + 1].value === type) {
        neighbors.push(map[item.x][item.y + 1]);
    }

    return neighbors;
}

/*export */
const pointRound = (pointCard1, pointCard2, _map) => {
    let point = 0;
    // let map = JSON.parse(_map);
    let A = Math.floor(((Math.random() * 201)));
    let B = Math.floor(((Math.random() * 201)));

    if (pointCard1.id === 0 || pointCard2.id === 0) {
        console.log("Gazdag síkság")

        const map = JSON.parse(JSON.stringify(_map));
        console.log(findIsolated("M", map));
        console.log(_map);
        
        // A
        if (pointCard1.id === 0 && pointCard2.id !== 0) {

            
        }

        // B
        if (pointCard1.id !== 0 && pointCard2.id === 0) {

        }
    }

    if (pointCard1.id === 1 || pointCard2.id === 1) {
        console.log("Nagyváros")
    }

    if (pointCard1.id === 2 || pointCard2.id === 2) {
        console.log("Üstvidék")
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

pointRound({ id: 0 }, { id: 1 },
    [
        ["M", "M", 0, "V", "V", 0],
        [0, 0, 0, "V", 0, 0],
        [0, "V", "V", "V", 0, 0],
        [0, "V", "V", 0, 0, 0],
        [0, 0, 0, "M", "M", "M"],
        [0, "M", 0, 0, 0, 0],
    ],
)