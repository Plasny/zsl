import './Item.css';

const Item = (props) => {
    const remove = () => {
        props.delFn(props.index)
    }

    return (
        <div className="item">
            <h3>{props.title}</h3>
            <p>{props.value}</p>
            <button onClick={remove}>delete item</button>
        </div>
    );
};

export default Item;
