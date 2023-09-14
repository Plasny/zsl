# Doktor Mario

Projekt rozwijany na zajęciach aplikacji klienckich, którego zadaniem było
nauczenia nas języka typescript, bundlowania modułów z pomocą webpacka-a 
i pisania dokumentacji z pomocą typedoc-a.

---

Dobrze wiedzieć:

- najlepiej włączyć opcję private w typedoc-u
- {@link ui `ui`} i {@link game `game`} są najlepiej udokumentowane

---

Przykład zastosowania klasy Game:

```ts
// src/index.ts
import { Game } from "./game";
import { startListening } from "./input";

startListening()
new Game()
```
