export const pointRound = (pointCard1,pointCard2,_map) => {
    let point = 0;
    let map = JSON.parse(_map);
    let A = Math.floor(((Math.random() * 201)));
    let B = Math.floor(((Math.random() * 201)));

    if(pointCard1.id === 0 || pointCard2.id === 0){
        console.log("Gazdag síkság")
        // A
        if(pointCard1.id === 0 && pointCard2.id !== 0){

        }

        console.log(map);
    }

    if(pointCard1.id === 1 || pointCard2.id === 1){
        console.log("Nagyváros")
    }

    if(pointCard1.id === 2 || pointCard2.id === 2){
        console.log("Üstvidék")
    }

    if(pointCard1.id === 3 || pointCard2.id === 3){
        console.log("Pajzsfal")
    }

    if(pointCard1.id === 4 || pointCard2.id === 4){
        console.log("Elveszett birtok")
    }

    if(pointCard1.id === 5 || pointCard2.id === 5){
        console.log("Töredezett utak")
    }

    if(pointCard1.id === 6 || pointCard2.id === 6){
        console.log("Kőmelléki erdő")
    }

    if(pointCard1.id === 7 || pointCard2.id === 7){
        console.log("Partmenti terjeszkedés")
    }

    if(pointCard1.id === 8 || pointCard2.id === 8){
        console.log("Zöld Gally")
    }

    if(pointCard1.id === 9 || pointCard2.id === 9){
        console.log("Fatorony")
    }

    if(pointCard1.id === 10 || pointCard2.id === 10){
        console.log("Az arany magtár")
    }

    if(pointCard1.id === 11 || pointCard2.id === 11){
        console.log("Faőrszem")
    }

    if(pointCard1.id === 12 || pointCard2.id === 12){
        console.log("Mágusok völgye")
    }

    if(pointCard1.id === 13 || pointCard2.id === 13){
        console.log("Csatorna tó")
    }

    if(pointCard1.id === 14 || pointCard2.id === 14){
        console.log("Vadközösség")
    }

    if(pointCard1.id === 15 || pointCard2.id === 15){
        console.log("Határvidék")
    }

    point = A+B;

    return {A,B,point};
}