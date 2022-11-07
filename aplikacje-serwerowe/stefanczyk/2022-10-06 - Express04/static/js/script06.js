function fetchGet() {
  const headers = { "Content-Type": "application/json" };

  fetch("/api", { method: "get", headers })
    .then((response) => response.json())
    .then((data) => console.log(data));
}

document.getElementById("fetchGet").addEventListener("click", fetchGet);
