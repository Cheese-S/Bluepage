import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SplashPage from './component/SplashPage'
import LogInPage from './component/LogInPage';
import RegisterPage from './component/RegisterPage';
import NavBar from './component/NavBar'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/"  element={<SplashPage/>} />
      <Route path="/login"  element={<LogInPage/>} />
      <Route path="/signup"  element={<RegisterPage/>} />
      <Route path="/nav/test" element={<NavBar/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
