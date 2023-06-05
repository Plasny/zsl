import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Verify() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [response, setResponse] = useState(<></>);
  const navigate = useNavigate();

  async function verifyAccount() {
    const token = searchParams.get("token");
    const res = await fetch("/api/users/confirm/" + token);

    if(res.status != 200) {
        setResponse(<p className="response">{(await res.json()).message}</p>)
    } else {
        setResponse(<></>)
        navigate("/")
    }
  }

  return (
    <div className="FullContainer">
      <div className="box">
        <h1>Weryfikacja konta</h1>
        <div style={{ margin: "10%", width: "80%", marginTop: "3.5rem" }}>
          {response}
          <button onClick={verifyAccount}>Zweryfikuj</button>
        </div>
      </div>
    </div>
  );
}
export default Verify;
