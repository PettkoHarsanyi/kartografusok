
export default function GameModal({closable=true,handleCloseModal,children}) {

    return (
        <div className="GameModal" id="modal" onClick={(e)=>{if(closable){handleCloseModal(e)}}}>
            <div className="GameModalContext">
                {children}
            </div>
        </div>
    )
}
