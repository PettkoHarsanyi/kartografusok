import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getActualPlayer } from "../../state/actualPlayer/selectors";
import { modifyPlayer } from "../../state/players/actions";
import { getRoom } from "../../state/room/selectors";
import clearButton from "../../assets/delete.png"

export default function DrawCanvas({ handleCloseModal }) {

    const dispatch = useDispatch();
    const actualPlayer = useSelector(getActualPlayer);

    const VILLAGE = "VILLAGE";
    const FOREST = "FOREST";
    const WATER = "WATER";
    const FARM = "FARM";
    const MONSTER = "MONSTER";
    const INIT_DRAWING = "INIT_DRAWING";
    const CARD_DRAW = "CARD_DRAW";
    const CARD_PLACE = "CARD_PLACE";

    const states = [INIT_DRAWING, CARD_DRAW, CARD_PLACE]
    const drawingStates = [VILLAGE, FOREST, WATER, FARM, MONSTER]
    const [currentDrawingState, setCurrentDrawingState] = useState(0);
    const [currentState, setCurrentState] = useState(0);
    const [drawings, setDrawings] = useState([]);

        const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawColor, setDrawColor] = useState("#993A30");

    useEffect(() => {
        const canvas = canvasRef.current;
        const div = document.getElementById("canvasDiv")
        canvas.width = div.clientWidth;
        canvas.height = div.clientHeight;

        const context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 5;
        context.strokeStyle = '#993A30';

        contextRef.current = context;

        document.body.onmouseup = function () {
            setIsDrawing(false);
        }
    }, [])

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true);
    }

    const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const holdDrawing = () => {
        contextRef.current.closePath()
    }

    const continueDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
    }

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
    }

    const changeColor = (bgcolor, color) => {
        setDrawColor(color);
        contextRef.current.strokeStyle = color;
        document.getElementById("canvasDiv").style.backgroundColor = bgcolor
    }


    useEffect(() => {
        switch (currentDrawingState) {
            case 0:
                changeColor("#522621", "#91332C")
                break;
            case 1:
                changeColor("#2C492E", "#506D37")
                break;
            case 2:
                changeColor("#2B3145", "#4F7286")
                break;
            case 3:
                changeColor("#72472F", "#B48A41")
                break;
            case 4:
                changeColor("#3F2A41", "#753351")
                break;
            default:
                break;
        }
    }, [currentDrawingState])

    const saveDrawing = (index) => {
        // let img = new Image();
        // img.src = canvasRef.current.toDataURL()
        let base64 = canvasRef.current.toDataURL()
        if (!drawings[currentDrawingState]) {
            setDrawings([...drawings, base64])
        } else {
            setDrawings(drawings.map((drawing, index) => {
                if (index === currentDrawingState) {
                    return base64;
                } else {
                    return drawing;
                }
            }))
        }
    }

    useEffect(() => {
        dispatch(modifyPlayer({ ...actualPlayer, fields: drawings }))
    }, [drawings])

    const loadDrawing = (direction) => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        if (drawings[currentDrawingState + direction]) {
            const base64 = drawings[currentDrawingState + direction]
            let img = new Image();
            img.src = base64;
            console.log("WIDTH: " + base64.width);

            img.onload = function () {
                contextRef.current.drawImage(img, 0, 0, img.width, img.height);
            };
            // const image = drawings[currentDrawingState + direction]
        }
    }
    return (
        <>
            {states[currentState] === INIT_DRAWING &&
                <>
                    <div className="ModalTitle"><div>Rajzolás</div></div>

                    <div className="ModalContext">
                        <div className="DrawMessage">
                            {drawingStates[currentDrawingState] === VILLAGE && <div>Rajzold meg a falvak terepmintáját!</div>}
                            {drawingStates[currentDrawingState] === FOREST && <div>Rajzold meg az erdők terepmintáját!</div>}
                            {drawingStates[currentDrawingState] === WATER && <div>Rajzold meg a vizek terepmintáját!</div>}
                            {drawingStates[currentDrawingState] === FARM && <div>Rajzold meg a farmok terepmintáját!</div>}
                            {drawingStates[currentDrawingState] === MONSTER && <div>Rajzold meg a szörnyek terepmintáját!</div>}
                        </div>

                        <div className="DrawContext">
                            <div className="DCDiv1">
                                <div className="InputWrapper">
                                    <div>Szín:</div>
                                    <div className="InputDiv">
                                        <input id="stroke" type="color" value={drawColor} name="stroke" onChange={(e) => { setDrawColor(e.target.value); contextRef.current.strokeStyle = e.target.value }}></input>
                                    </div>
                                </div>
                                <div className="InputWrapper">
                                    <div>Erősség:</div>
                                    <div className="InputDiv">
                                        <input id="lineWidth" min="1" max="21" type="range" name="lineWidth" defaultValue="5" step="2" onChange={(e) => { contextRef.current.lineWidth = e.target.value }}></input>
                                    </div>
                                </div>
                            </div>
                            <div className="DCDiv2">
                                <img className="ClearButton" src={clearButton} alt="clear" onClick={() => { contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height) }} />
                                <div id="canvasDiv" className="CanvasDiv">
                                    <canvas id="drawing-board"
                                        onMouseDown={startDrawing}
                                        onMouseUp={finishDrawing}
                                        onMouseMove={draw}
                                        onMouseEnter={continueDrawing}
                                        onMouseLeave={holdDrawing}
                                        ref={canvasRef}
                                    ></canvas>
                                </div>
                            </div>
                            <div className="DCDiv3">
                                <button disabled={currentDrawingState === 0 ? true : false}
                                    style={{ color: currentDrawingState === 0 ? "gray" : "white", backgroundColor: currentDrawingState === 0 ? "#2d2d2d" : "dimgray" }}
                                    onClick={() => {
                                        if (currentDrawingState > 0) {
                                            saveDrawing()
                                            loadDrawing(-1)
                                            setCurrentDrawingState(currentDrawingState - 1)
                                        }

                                    }}
                                >
                                    VISSZA
                                </button>

                                {currentDrawingState < drawingStates.length - 1 ?
                                    <button
                                        onClick={() => {
                                            saveDrawing()
                                            loadDrawing(1)
                                            setCurrentDrawingState(currentDrawingState + 1)
                                        }}
                                        style={{ backgroundColor: "dimgray", transition: "0.5s" }}
                                    >
                                        ELŐRE
                                    </button>
                                    :
                                    <button
                                        onClick={(e) => {
                                            saveDrawing()
                                            /*
                                            Synchronize state
                                            */
                                            handleCloseModal(e,"drawModal")
                                        }}
                                        style={{ backgroundColor: "dodgerblue" }}>
                                        KÉSZ
                                    </button>
                                }


                            </div>
                        </div>
                    </div>
                </>
            }
        </>)
}
