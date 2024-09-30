import React, { useState } from 'react';
import axios from 'axios';

const host = window.location.hostname;

const Register = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    console.log(host);
    e.preventDefault();

    try {
      // Send registration data to the authserver
      const response = await axios.post('http://'+host+':3000/api/register', {
        username,
        password,
      });

      // Save token in localStorage (or cookie, depending on your setup)
      localStorage.setItem('token', response.data.token);

      // Set logged in state in parent component
      setLoggedIn(true);
    } catch (err) {
      setError('Registration failed, please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
