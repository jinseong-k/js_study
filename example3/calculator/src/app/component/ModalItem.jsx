function ModalElement() {
    return (
        <div className="modal-window">
            <ModalContents />
        </div>
    );
}

function ModalContents() {
    return (
        <div className="modal-contents">
        </div>
    );
}

export function ModalItem() {
    return (
        <div className="modal-overlay">
            <ModalElement />
        </div>
    );
}
