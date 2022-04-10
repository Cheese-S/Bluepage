import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SplashPage } from './component/SplashPage'
import { LogInPage } from './component/LogInPage';
import { RegisterPage } from './component/RegisterPage';
import { ButtonAppBar } from './component/NavBar'
import ListPage from './component/ListPage';
import ViewChapterPage from './component/ViewChapter';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/"  element={<ViewChapterPage/>} />
      <Route path="/login"  element={<LogInPage/>} />
      <Route path="/signup"  element={<RegisterPage/>} />
      <Route path="/nav/test" element={<ButtonAppBar/>} />
      <Route path="/list/test" element={<ListPage/>} />
      <Route path="chapter/test" element={<ViewChapterPage/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
