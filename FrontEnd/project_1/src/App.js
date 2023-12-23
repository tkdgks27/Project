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
import MyPage from './mainmenu/MyPage';
import BoardList from './mainmenu/BoardLists';
import QnA from './mainmenu/Q&A';
import Suggestion from './mainmenu/Suggestions';
import Notice from './mainmenu/Notice';
import Use from './mainmenu/Use';
import Privacy from './mainmenu/Privacy';
import AD from './mainmenu/AD';
import LogOut from './mainmenu/LogOut';
import GoInfo from './user/goInfo';
import BoardDetail from './mainmenu/BoardDetail';
import NewBoard from './mainmenu/newBoard';
import DataRoom from './mainmenu/DataRoom';


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
        <Route path="/mypage" element={<MyPage/>}/>
        <Route path="/board" element={<BoardList/>}/>
        <Route path="/board" element={<BoardDetail/>}/>
        <Route path="/qna" element={<QnA/>}/>
        <Route path="/suggestions" element={<Suggestion/>}/>
        <Route path="/notice" element={<Notice/>}/>
        <Route path="/use" element={<Use/>}/>
        <Route path="/privacy" element={<Privacy/>}/>
        <Route path="/ad" element={<AD/>}/>
        <Route path="/logout" element={<LogOut/>}/>
        <Route path="/ginfo" element={<GoInfo />} />
        {/* <Route path="/admin" element={<AdminLogin />} /> */}
        <Route path="/boardwrite" element={<NewBoard />} />
        {/* <Route path="/admin" element={<AdminPage />} /> */}
        <Route path="/2board" element={<NewBoard />} />
        <Route path="/dataroom" element={<DataRoom />} />
      </Routes>
    </Router>
  );
}

export default App;