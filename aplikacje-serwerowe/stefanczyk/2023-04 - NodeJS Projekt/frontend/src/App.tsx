// @ts-ignore
import {ReactComponent as Logo} from './assets/command-line-pixel.svg';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import NotFound from './components/NotFound';
import './App.css'

function NavLink(props: {path: string, name: string}) {
  const location = useLocation();
  if (props.path === location.pathname)
    return <Link to={props.path} className="current" >{props.name}</Link>
  
  return <Link to={props.path}>{props.name}</Link>
}

function App() {
  return (
    <Router>
      <nav>
        <Link to='/'>
          <Logo stroke="#00ff00" height="2.5rem" width="2.5rem" style={{}} />
        </Link>

        <NavLink path="/feed" name="Feed" />
        <NavLink path="/profile" name="Profile" />
      </nav>

      <main>
        <Routes>
          <Route caseSensitive path="/" element={<p>Root</p>} />
          <Route caseSensitive path="/feed" element={<p>Feed</p>} />
          <Route caseSensitive path="/profile" element={<p>Profile</p>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>&copy; Paweł Pasternak 2023</footer>
    </Router>
  )
}

export default App
