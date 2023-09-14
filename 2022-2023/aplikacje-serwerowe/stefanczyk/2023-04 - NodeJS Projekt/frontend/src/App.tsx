import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import store from "./store/store";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Root from "./pages/Root";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />

        <main>
          <Routes>
            <Route caseSensitive path="/" element={<Root />} />
            <Route caseSensitive path="/feed" element={<Feed />} />
            <Route
              caseSensitive
              path="/profile/:userId"
              element={<Profile />}
            />
            <Route caseSensitive path="/profile" element={<Profile />} />
            <Route caseSensitive path="/login" element={<Login />} />
            <Route caseSensitive path="/register" element={<Register />} />
            <Route caseSensitive path="/verify" element={<Verify />} />
            <Route caseSensitive path="/settings" element={<p>Ustawienia</p>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
