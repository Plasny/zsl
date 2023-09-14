import './Dialog.css';

const Dialog = (props) => {
    let open = false;
    if (props.index !== -1) {
        open = true;
    }

    const remove = () => {
        props.delFn(props.index);
    };

    return (
        <dialog open={open}>
            <p>Remove?</p>
            <form method="dialog">
                <button value="cancel">Cancel</button>
                <button value="confirm" onClick={remove}>Confirm</button>
            </form>
        </dialog>
    );
};

export default Dialog;
