import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Signup from './Signup';
import Login from './Login';

const Root = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setTokenInLocalStorage = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App token={token} setToken={setTokenInLocalStorage} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={setTokenInLocalStorage} />} />
      </Routes>
    </Router>
  );
};

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
