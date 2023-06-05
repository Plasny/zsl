// @ts-ignore
import { ReactComponent as Logo } from "../assets/command-line-pixel.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { urls } from "../layouts/noNavbarUrls";
import { useState, useRef, useLayoutEffect, useEffect, Ref } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../stores/store";

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

function clickOutside(ref: any, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(e: Event) {
      if (
        ref.current &&
        !(ref.current as HTMLDivElement).contains(e.target as Node)
      ) {
        setTimeout(callback, 0);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [displayMenu, setMenu] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);
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
      <div className="userBtn" ref={btnRef}>
        <div
          style={{
            borderRight: "2px solid var(--accent-color)",
            padding: "0 0.5rem",
          }}
          onClick={() => setMenu(true)}
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
        <Link to="/settings">Ustawienia</Link>
        <div onClick={() => {dispatch(logout()); setMenu(false)}}>Wyloguj</div>
      </div>
    );
  else menuEl = <></>;

  return (
    <nav>
      <div style={{ justifyContent: "left" }}>
        <Link to="/">
          <Logo stroke="#00ff00" height="2.5rem" width="2.5rem" style={{}} />
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
