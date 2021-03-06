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
import FourOFourPage from './component/FourOFourPage';
import { MyFollowing } from './component/MyFollowing';

function App() { 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/"  element={<SplashPage/>} />
      <Route path="/login"  element={<LogInPage/>} />
      <Route path="/signup"  element={<RegisterPage/>} />
      <Route path="/resetpassword" element={<ResetPasswordPage/>} />
      <Route path="/list/:id/:type" element={<ListPage/>} />
      <Route path="/chapter/:id/:subtype" element={<ViewStoryChapter/>} />
      <Route path="/page/:id/:subtype" element={<ViewComicPage/>} />
      <Route path="/profile/:id" element={<ProfilePage/>} />
      <Route path="/page/edit/:id" element={<EditPage/>} />
      <Route path="/search/:sortmode/:searchmode/:searchstring/:page" element={<SearchPage/>} />
      <Route path="/home" element={<HomePage/>}/>
      <Route path="/chapter/edit/:id" element={<EditChapter/>}/>
      <Route path="/changepassword" element={<ChangePassword/>}/>
      <Route path="/404" element={<FourOFourPage/>}/>
      <Route path="/following" element={<MyFollowing/>}/>
    </Routes>
    </BrowserRouter>
  );
}
export default App;