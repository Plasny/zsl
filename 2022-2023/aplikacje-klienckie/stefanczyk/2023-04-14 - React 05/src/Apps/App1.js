import './App1.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { Home, About } from '../Components/base';
import { Divs, DivsAbout } from '../Components/divs';
import { Post, PostsList } from '../Components/posts';

function App() {
  return (
    <Router>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/about'>About</Link>
        <Link to='/divs'>Divs</Link>
        <Link to='/posts'>Posts</Link>
      </nav>

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/divs' element={<DivsAbout />} />
        <Route exact path='/divs/:count' element={<Divs />} />
        <Route exact path='/posts' element={<PostsList />} />
        <Route exact path='/posts/:id' element={<Post />} />
        <Route path='*' element={<h1>Page not found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
