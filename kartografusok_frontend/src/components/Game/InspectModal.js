
export default function InspectModal({closable=true,handleCloseModal,children}) {

    return (
        <div className="InspectModal" id="inspectModal" onClick={(e)=>{if(closable){handleCloseModal(e,"inspectModal")}}}>
            <div className="InspectModalContext">
                {children}
                <div className="DivShadow"></div>
            </div>
        </div>
    )
}
