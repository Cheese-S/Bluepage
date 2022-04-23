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
import {HomePage} from './component/HomePage';
import EditChapter from './component/EditChapter';
import { ResetPasswordPage } from './component/ResetPassword';
import {ChangePassword} from './component/ChangePassword';

function App() { 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/"  element={<SplashPage/>} />
      <Route path="/login"  element={<LogInPage/>} />
      <Route path="/signup"  element={<RegisterPage/>} />
      <Route path="/resetpassword" element={<ResetPasswordPage/>} />
      <Route path="/nav/test" element={<ButtonAppBar/>} />
      <Route path="/list/test" element={<ListPage/>} />
      <Route path="/list/:id/:type" element={<ListPage/>} />
      <Route path="/chapter/test" element={<ViewStoryChapter/>} />
      <Route path="/chapter/:id" element={<ViewStoryChapter/>} />
      <Route path="/page/test" element={<ViewComicPage/>} />
      <Route path="/page/:id" element={<ViewComicPage/>} />
      <Route path="/profile/test/:id" element={<ProfilePage/>} />
      <Route path="/page/edit" element={<EditPage/>} />
      <Route path="/search" element={<SearchPage/>} />
      <Route path="/home/test" element={<HomePage/>}/>
      <Route path="/chapter/edit" element={<EditChapter/>}/>
      <Route path="/changepassword" element={<ChangePassword/>}/>
    </Routes>
    </BrowserRouter>
  );
}
export default App;