import { useSelector } from "react-redux"
import { getPlayers } from "../../state/players/selectors"
import "../../css/GameEndModal.css"
import { Link } from "react-router-dom";
import { getActualPlayer } from "../../state/actualPlayer/selectors";

export default function GameEndModal({ }) {
    const players = useSelector(getPlayers);
    const actualPlayer = useSelector(getActualPlayer);

    return (
        <div className="GameEndModal" id="gameEndModal">
            <div className="Context">
                <div className="Div1">Játék vége</div>
                <div className="Div2">
                    <div>Eredmények:</div>
                    <div className="ResultsDiv">
                        {players && players.map((player,index) => {
                            return (
                                <div key={index} className="Player">{index+1}. {player.name} - {player.gamePoints} pont</div>
                            )
                        })}
                    </div>
                </div>
                <div className="Div3">
                    <button onClick={(e) => {
                        document.getElementById("gameEndModal").style.display = "none";
                    }}>Vissza</button>
                    {(actualPlayer.guest ? <Link to="/regisztracio">Regisztráció</Link> : "")}
                    <Link to="/">Kilépés</Link>
                </div>
            </div>
        </div>
    )
}
