
export default function GameModal({closable=true}) {

    const handleCloseModal = (e) => {
        if (e.target !== e.currentTarget || !closable) return;
        const component = e.target;
        component.remove();
    }

    return (
        <div className="GameModal" onClick={(e)=>handleCloseModal(e)}>
            <div className="GameModalContext">

            </div>
        </div>
    )
}