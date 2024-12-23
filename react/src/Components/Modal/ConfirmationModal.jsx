import React from "react";
import Button from "../Button/Button";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ id, icon, headerText, bodyText, onConfirm }) => {
    return (
        <div
            className="modal fade confirmation"
            id={id}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body d-flex justify-content-center gap-4 pt-0">
                        <div className="left-content">
                            <img
                                src={`${window.location.protocol}//${window.location.hostname}:8000/icon/${icon}`}
                                alt="Icon"
                            />
                        </div>
                        <div className="right-content">
                            <h1>{headerText}</h1>
                            <p>{bodyText}</p>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-around mb-4">
                        <Button
                            color="yellow"
                            data-bs-dismiss="modal"
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                // document.querySelector(`#${id}`).modal("hide"); //not working due to bootstrap js
                            }}
                        >
                            Yes, confirm
                        </Button>
                        <Button data-bs-dismiss="modal">No, cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
