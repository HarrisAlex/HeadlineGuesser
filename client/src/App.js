"use client"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/main.css';

import Colors from './constants/Colors.jsx';

import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Leaderboard from './pages/leaderboard.jsx';
import NavBar from './components/navBar.jsx';

function App() {
  return (
    <main style={{
      backgroundColor: Colors.Background(false),
      color: Colors.Text(false),
      minHeight: "100svh"
    }}>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/index" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
