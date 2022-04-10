import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SplashPage } from './component/SplashPage'
import { LogInPage } from './component/LogInPage';
import { RegisterPage } from './component/RegisterPage';
import { ButtonAppBar } from './component/NavBar'
import ListPage from './component/ListPage';
import ViewStoryChapter from './component/ViewStoryChapter';
import ViewComicPage from './component/ViewComicPage';
import ProfilePage from './component/ProfilePage';
import EditPage from './component/EditPage';
import SearchPage from './component/SearchPage';
import HomePage from './component/HomePage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/"  element={<SplashPage/>} />
      <Route path="/login"  element={<LogInPage/>} />
      <Route path="/signup"  element={<RegisterPage/>} />
      <Route path="/nav/test" element={<ButtonAppBar/>} />
      <Route path="/list/test" element={<ListPage/>} />
      <Route path="/chapter/test" element={<ViewStoryChapter/>} />
      <Route path="/page/test" element={<ViewComicPage/>} />
      <Route path="/profile/test" element={<ProfilePage/>} />
      <Route path="/page/edit" element={<EditPage/>} />
      <Route path="/search" element={<SearchPage/>} />
      <Route path="/home" element={<HomePage/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
