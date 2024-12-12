import React from "react";
import PropTypes from "prop-types";

const Modal = ({
    id,
    title,
    showError,
    errorMessage,
    formData,
    handleInput,
    onSubmit,
    fields,
    buttons,
}) => {
    return (
        <div
            id={id}
            className="modal fade"
            tabIndex="-1"
            aria-labelledby={`${id}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    {showError && (
                        <div className="alert alert-danger m-2">
                            {errorMessage}
                        </div>
                    )}
                    <form className="p-3" method="post" onSubmit={onSubmit}>
                        {/* Dynamic Form Fields */}
                        {fields.map((field, index) => (
                            <div key={index} className="mb-3">
                                <label className="form-label">
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    className="form-control"
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleInput}
                                />
                            </div>
                        ))}

                        <div className="button-container d-flex justify-content-end gap-3">
                            {buttons.map((button, index) => (
                                <button
                                    key={index}
                                    type={button.type}
                                    className={`btn btn-${
                                        button.color || "primary"
                                    }`}
                                    {...button.props}
                                >
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Prop Validation
Modal.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    showError: PropTypes.bool,
    errorMessage: PropTypes.string,
    formData: PropTypes.object.isRequired,
    handleInput: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
        })
    ).isRequired,
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            color: PropTypes.string,
            props: PropTypes.object,
        })
    ).isRequired,
};

export default Modal;
