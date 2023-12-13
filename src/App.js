import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './main/main';
import FileUpload from './gallery/fileUpload';
import SignIn from './signin/signIn';
import Useraccount from './user/useraccount';
import NaverLogin from './signin/naverlogin';
import FindId from './signin/findid';
import MemberList from './user/membercheck';
import MyPage from './mainroutes/MyPage';
import BoardList from './mainroutes/BoardLists';
import QnA from './qna/Q&A';
import Suggestion from './mainroutes/Suggestions';
import Notice from './mainroutes/Notice';
import Privacy from './mainroutes/Privacy';
import LogOut from './logout/LogOut';
import Use from './mainroutes/Use';
import AD from './mainroutes/AD';


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
        <Route path="/mypage" element={<MyPage/>}/>
        <Route path="/board" element={<BoardList/>}/>
        <Route path="/qna" element={<QnA/>}/>
        <Route path="/suggestions" element={<Suggestion/>}/>
        <Route path="/notice" element={<Notice/>}/>
        <Route path="/use" element={<Use/>}/>
        <Route path="/privacy" element={<Privacy/>}/>
        <Route path="/ad" element={<AD/>}/>
        <Route path="/logout" element={<LogOut/>}/>
      </Routes>
    </Router>
  );
}

export default App;
