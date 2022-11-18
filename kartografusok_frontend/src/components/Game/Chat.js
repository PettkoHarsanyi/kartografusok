import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import authHeader from "../../auth/auth-header";
import { socketApi } from "../../socket/SocketApi";
import { getActualPlayer } from "../../state/actualPlayer/selectors";
import { addMessage } from "../../state/messages/actions";
import { getMessages } from "../../state/messages/selectors"
import { getRoom } from "../../state/room/selectors";
import { getState } from "../../state/selector";

export default function Chat() {
    const messages = useSelector(getMessages)
    const actualPlayer = useSelector(getActualPlayer);
    const room = useSelector(getRoom)
    const state = useSelector(getState);
    const dispatch = useDispatch()

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const input = document.getElementById('input')

        if (input.value !== "") {
            let message = "";
            if (!actualPlayer.isGuest) {
                const response = await axios.post(`api/users/${actualPlayer.id}/message`, {
                    message: input.value,
                }, {
                    headers: authHeader()
                });

                let message = response.data;

                message.user = actualPlayer; // Azért kell, mert a responseban nem tudom populálni a user-t

            }else{
                message = {user: actualPlayer, id: -messages.length, message: input.value}
            }

            // dispatch(addMessage(message))
            dispatch(addMessage(message))

            input.value = ""

            input.focus({ focusVisible: true });
        }

    }

    useEffect(() => {
        var chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight;
        if (room.roomCode) {
            socketApi.syncState(room.roomCode, state, true, (ack) => {/*console.log(ack)*/ })
        }
    }, [messages])

    return (
        <form className='ChatDiv' onSubmit={(e) => handleSendMessage(e)} autoComplete="off">
            <div className='ChatDivContent' id="chat">
                {messages && messages.length > 0 &&
                    messages.map((message, index) => {
                        return (<div key={message.id} className='Message'><div className='MessagerName'>{message.user.name}</div><div className='MessageText'>{message.message}</div></div>)
                    })
                }
            </div>
            <div className='ChatDivInput'>
                <input disabled={actualPlayer.muted} style={{ cursor: actualPlayer.muted ? "not-allowed" : "text" }} className='ChatInput' id="input" placeholder={actualPlayer.muted ? 'Némítva vagy🤐' : 'Levelezés 😂📯📩✍'} />
                <button disabled={actualPlayer.muted} style={{ cursor: actualPlayer.muted ? "not-allowed" : "pointer" }} className='ChatButton' type='submit'>{actualPlayer.muted ? '🚫' : "Küldés"}</button>
            </div>
        </form>
    )
}