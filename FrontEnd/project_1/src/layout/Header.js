import React, { useEffect, useState } from "react";
import "./Headerds.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    document.title = "AI를 활용한 음성합성 프로그램";
    const token = sessionStorage.getItem("token");
    if (token) {
      axios
      .post("http://localhost:3001/login.do", token)
      .then((res) => {
        setIsLoggedIn(true);
        setUsername(res.data.id)
      })
      .catch((error) => {
        console.error("오류 : ", error);
      });
    }
  }, []);

//   const setlogout = () => {

//   }

  return (
    <header className="mainmenuds">
      <div className="mainlogo">
        <a href="/" className="homeds">
          AI를 활용한
          <br></br>
          음성합성 프로그램
        </a>
      </div>
      <div className="mainmenubx">
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/board" className="boardds">
          게시판
        </a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/qna" className="qnads">
          Q&A
        </a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/suggestions" className="sugds">
          건의사항
        </a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/dataroom" className="dtrds">
          DataRoom
        </a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
      </div>
      <div className="mypagebx">
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/mypage" className="mpds">
          MyPage
        </a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/logout" className="logoutds">
          LogOut
        </a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/signin" className="loginds">
          로그인
        </a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
      </div>
    </header>
  );
};

export default Header;
