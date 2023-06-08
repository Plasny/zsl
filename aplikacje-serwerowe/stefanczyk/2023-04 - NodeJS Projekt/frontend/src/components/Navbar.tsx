// @ts-ignore
import { ReactComponent as Logo } from "../assets/command-line-pixel.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { urls } from "../helpers/noNavbarUrls";
import { useState, useRef, useLayoutEffect, useEffect, Ref } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import clickOutside from "../helpers/clickOutside";

function NavLink(props: { path: string; name: string }) {
  const location = useLocation();
  if (props.path === location.pathname)
    return (
      <Link to={props.path} className="current">
        {props.name}
      </Link>
    );

  return <Link to={props.path}>{props.name}</Link>;
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [displayMenu, setMenu] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);
  const defaultTokenText = "Skopiuj token";
  const [copyTokenText, setCopyTokenText] = useState(defaultTokenText);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useLayoutEffect(() => {
    if (btnRef.current)
      setMenuWidth((btnRef.current! as HTMLDivElement).offsetWidth);
  });

  clickOutside(menuRef, () => setMenu(false));

  let userBtn;
  let menuEl;

  if (urls.includes(location.pathname)) return <></>;

  if (user.loggedIn) {
    userBtn = (
      <div className="userBtn" ref={btnRef} onClick={() => setMenu(true)}>
        <div
          style={{
            borderRight: "2px solid var(--accent-color)",
            padding: "0 0.5rem",
          }}
        >
          {user.id}
        </div>
        <img
          src={user.pictureUrl}
          alt="Profile picture"
          style={{ width: "2.5rem" }}
        />
      </div>
    );
  } else {
    userBtn = (
      <div className="userBtn" ref={btnRef}>
        <div onClick={() => navigate("/login")} style={{ padding: "0 0.5rem" }}>
          Login
        </div>
      </div>
    );
  }

  if (displayMenu)
    menuEl = (
      <div className="profileMenu" style={{ width: menuWidth }} ref={menuRef}>
        <Link to="/settings">Edycja profilu</Link>
        <div
          onClick={() => {
            navigator.clipboard.writeText(user.authToken);
            setCopyTokenText("Token został skopiowany :)");
            setTimeout(() => setCopyTokenText(defaultTokenText), 1000);
          }}
        >
          {copyTokenText}
        </div>
        <div
          onClick={() => {
            dispatch(logout());
            setMenu(false);
            navigate("/login");
          }}
        >
          Wyloguj
        </div>
      </div>
    );
  else menuEl = <></>;

  return (
    <nav>
      <div style={{ justifyContent: "left" }}>
        <Link to="/">
          <Logo stroke="#00ff00" height="2.5rem" width="2.5rem" />
        </Link>

        <NavLink path="/feed" name="Feed" />
        <NavLink path="/profile" name="Profile" />
      </div>
      <div style={{ justifyContent: "right" }}>{userBtn}</div>
      {menuEl}
    </nav>
  );
}

export default Navbar;
