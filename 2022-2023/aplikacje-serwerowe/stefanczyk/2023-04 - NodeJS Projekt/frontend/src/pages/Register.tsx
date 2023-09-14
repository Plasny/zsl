import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import "./Login.css";

function Register() {
  const [response, setResponse] = useState(<></>);
  const navigate = useNavigate();

  async function register(this: HTMLFormElement, e: FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: (document.getElementById("name") as HTMLInputElement)!.value,
        surname: (document.getElementById("surname") as HTMLInputElement)!
          .value,
        password: (document.getElementById("password") as HTMLInputElement)!
          .value,
        email: (document.getElementById("email") as HTMLInputElement)!.value,
      }),
    });

    if (res.status !== 200) {
      const message = (await res.json()).message;
      setResponse(<p className="response">{message}</p>);
    } else {
      setResponse(<></>);

      const json = await res.json();
      navigate("/verify?token=" + json.returnValue);
    }
  }

  return (
    <div className="FullContainer">
      <div className="box">
        <h1>Rejestracja</h1>
        <form onSubmit={register}>
          <label htmlFor="name">Imię:</label>
          <input type="text" name="name" id="name" required />
          <label htmlFor="surname">Nazwisko:</label>
          <input type="text" name="surname" id="surname" required />
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" required />
          <label htmlFor="pass">Hasło:</label>
          <input type="password" name="password" id="password" required />
          {response}
          <button type="submit">Zarejestruj się</button>
          <p className="small">
            Masz już konto? <Link to="/login">Zaloguj się!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
