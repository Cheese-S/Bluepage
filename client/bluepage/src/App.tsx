import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SplashPage from './component/SplashPage'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/"  element={<SplashPage/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
