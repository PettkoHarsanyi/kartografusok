import "../../css/Game.css";
import GameModal from "./GameModal";


export default function Game() {

    return (
        <div className="Game">
            <GameModal closable={false} />
        </div>
    )
}