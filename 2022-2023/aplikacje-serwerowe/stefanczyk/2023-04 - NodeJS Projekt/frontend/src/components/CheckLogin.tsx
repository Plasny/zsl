import { useSelector } from "react-redux";
import { storeType } from "../store/store";
import { Link } from "react-router-dom";

export function checkLogin(el: JSX.Element) {
  const user = useSelector((state) => (state as storeType).user);

  if (user.loggedIn) return el;

  return (
    <div className="container">
      <p style={{ padding: "0 5rem", lineHeight: "2.5rem" }}>
        Musisz się <Link to="/login">zalogować</Link> aby zobaczyć tę stronę
      </p>
    </div>
  );
}
