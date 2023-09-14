import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./divs.css";

function DivEl(props) {
    const [count, setCount] = useState(props.nr)

    function increment() {
        setCount(count + 1)
    }

    return(
        <div className="box" onClick={increment}>
            {count}
        </div>
    )
}

export function Divs() {
  const { count } = useParams();

  let divsArray = [];
  for (let i = 1; i <= count; i++) {
    divsArray.push(<DivEl nr={i} />);
  }

  return (
    <>
      <h2>Divs</h2>
      <div className="box-container">{divsArray}</div>
    </>
  );
}

export function DivsAbout() {
  return (
    <>
      <h2>Exmple links</h2>
      <ul>
        <li>
          <Link to="/divs/1">1 div</Link>
        </li>
        <li>
          <Link to="/divs/10">10 divs</Link>
        </li>
        <li>
          <Link to="/divs/50">50 divs</Link>
        </li>
      </ul>
    </>
  );
}
