"use client"
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { LanguageProvider } from './contexts/LanguageContext.js';

import Colors from './constants/Colors.jsx';

import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Leaderboard from './pages/leaderboard.jsx';
import Profile from './pages/profile.jsx';
import NavBar from './components/navBar.jsx';
import DarkModeToggle from './components/darkModeToggle.jsx';
import LanguageSelector from './components/languageSelector.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleDarkModeToggle = this.handleDarkModeToggle.bind(this);

    this.state = {
      darkMode: localStorage.getItem("darkMode") === "true",
      languageSelectWindowOpen: false
    };
  }

  handleDarkModeToggle() {
    // Set the dark mode to the opposite of what it currently is
    let dark = localStorage.getItem("darkMode") === "true";
    localStorage.setItem("darkMode", !dark);

    // Update the colors
    Colors.UpdateDarkMode();

    // Update the state to force a re-render
    this.setState({ darkMode: localStorage.getItem("darkMode") === "true" });
  }

  handleLanguageSelectButton = () => {
    this.setState({ languageSelectWindowOpen: !this.state.languageSelectWindowOpen });
  }

  render() {
    return (
      <main style={{
        backgroundColor: Colors.Background(),
        color: Colors.Text(),
        minHeight: "100svh"
      }}>
        <LanguageProvider>
            <NavBar />
            <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/index" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
            </Router>
            <DarkModeToggle onClick={this.handleDarkModeToggle} />
            <LanguageSelector />
        </LanguageProvider>
      </main>
    );
  }
}