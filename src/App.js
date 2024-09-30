import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Chat from './chat';  // Your chat component



const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token is already saved in localStorage (i.e., user is already logged in)
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear token and set loggedIn to false
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <nav>
          {loggedIn && <button onClick={handleLogout}>Logout</button>}
        </nav>
        <Routes>
          <Route path="/login" element={!loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Navigate to="/chat" />} />
          <Route path="/register" element={!loggedIn ? <Register setLoggedIn={setLoggedIn} /> : <Navigate to="/chat" />} />
          <Route path="/chat" element={loggedIn ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/" element={loggedIn ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
