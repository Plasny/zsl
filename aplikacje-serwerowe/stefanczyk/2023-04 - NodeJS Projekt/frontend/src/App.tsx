import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import store from "./stores/store";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />

        <main>
          <Routes>
            <Route caseSensitive path="/" element={<p>Root</p>} />
            <Route caseSensitive path="/feed" element={<p>Feed</p>} />
            <Route caseSensitive path="/profile" element={<p>Profile</p>} />
            <Route caseSensitive path="/login" element={<Login />} />
            <Route caseSensitive path="/register" element={<Register />} />
            <Route caseSensitive path="/verify" element={<Verify />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
