
export default function GameModal({closable=true,handleCloseModal,children}) {

    return (
        <div className="DrawModal" id="drawModal" onClick={(e)=>{if(closable){handleCloseModal(e,"drawModal")}}}>
            <div className="DrawModalContext">
                {children}
            </div>
        </div>
    )
}
