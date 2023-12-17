import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './main/main';
import FileUpload from './gallery/fileUpload';
import SignIn from './signin/signIn';
import Useraccount from './user/useraccount';
import NaverLogin from './signin/naverlogin';
import FindId from './signin/findid';
import MemberList from './user/membercheck';
import UserInfo from './user/UserInfo';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/gallery" element={<FileUpload />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/user" element={<Useraccount />} />
        <Route path="/naverlogin" element={<NaverLogin />} />
        <Route path="/find" element={<FindId />} />
        <Route path="/member" element={<MemberList />} />
        <Route path="/info" element={<UserInfo />} />
      </Routes>
    </Router>
  );
}

export default App;