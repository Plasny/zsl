import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import "./Login.css";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/userSlice";

function Login() {
  const navigate = useNavigate();
  const [response, setResponse] = useState(<></>);
  const dispatch = useDispatch();

  function parseJWT(token: string) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  async function login(this: HTMLFormElement, e: FormEvent) {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement)!.value;
    const pass = (document.getElementById("password") as HTMLInputElement)!
      .value;
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: pass,
        email: email,
      }),
    });

    if (res.status !== 200) {
      const message = (await res.json()).message;
      setResponse(<p className="response">{message}</p>);
    } else {
      setResponse(<></>);

      const json = await res.json();
      // console.log(parseJWT(json.returnValue));

      const imgUrl = await fetch("/api/profile/picture/" + email, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + json.returnValue,
        },
      })
        .then((res) => res.blob())
        .then((res) => URL.createObjectURL(res))
        .catch((err) => console.log(err));

      dispatch(
        storeLogin({ id: email, token: json.returnValue, pictureUrl: imgUrl })
      );
      navigate("/");
    }
  }

  return (
    <div className="FullContainer">
      <div className="box">
        <h1>Logowanie</h1>
        <form onSubmit={login}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder={"example@example.org"}
            required
          />
          <label htmlFor="pass">Hasło:</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder={"*********"}
            required
          />
          {response}
          <button type="submit">Zaloguj</button>
          <p className="small">
            Nie masz jeszcze konta? <Link to="/register">Zarejestruj się!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
