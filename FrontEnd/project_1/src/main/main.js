import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Headerds.css";
import axios from "axios";

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myid, setMyId] = useState("");
  const token = sessionStorage.getItem("token");

  const connectionCheck = () => {
    axios
      .post("http://localhost:3001/parse.JWT", token, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("토큰 검증 성공", res.data);
        setMyId(res.data);
      })
      .catch((error) => {
        console.error("토큰 검증 중 오류 발생:", error);
      });
  };

  useEffect(() => {
    connectionCheck();
    document.title = "AI를 활용한 음성합성 프로그램";
    setIsLoggedIn(!!token);
  }, []);

  const bodyStyle = {
    backgroundColor: "#17171e",
    margin: 0,
    paddingTop: 90,
    paddingBottom: 10,
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",
  };

  const mainlogoStyle = {
    position: "absolute",
    left: "20px",
    top: "20px",
  };

  const mainmenubxStyle = {
    position: "absolute",
    left: "140px",
    top: "50px",
  };

  const mypagebxStyle = {
    position: "absolute",
    right: "20px",
    top: "20px",
    display: "flex",
    alignItems: "center",
  };

  const formStyle = {
    width: "220px",
    padding: "10px",
    border: "2px solid #fff",
    borderRadius: "10px",
    backgroundColor: "#1f1f2e",
    color: "#fff",
    marginRight: "930px",
    // display: "flex",
    alignItems: "center",
  };

  const welcomeStyle = {
    marginRight: "20px",
  };

  return (
    <div style={bodyStyle}>
    <div style={mainlogoStyle} className="mainlogo">
        <a href="/" className="homeds">
          AI를 활용한
          <br />
          음성합성 프로그램
        </a>
      </div>
      <div style={mainmenubxStyle} className="mainmenubx">
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
      <div style={mypagebxStyle} className="mypagebx">
        {isLoggedIn ? (
          <form style={formStyle}>
            <p style={welcomeStyle}>{myid.id}님, 안녕하세요! </p>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="/mypage" className="mpds">
              MyPage
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="/logout" className="logoutds">
              LogOut
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
          </form>
        ) : (
          <>
            <a href="/signin" className="loginds">
              로그인
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
