import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  useEffect(() => {
    document.title = "AI를 활용한 음성합성 프로그램"
  })

  const bodyStyle = {
    backgroundColor: "#17171e",
    margin: 0,
    padding: 0,
    height: "100vh",
  };

  const fontStyle = {
    color: "white",
  }

  const loginButtonStyle = {
    position: "absolute",
    top: "30px",
    right: "90px",
  };

  const infoButtonStyle = {
    position: "absolute",
    top: "30px",
    right: "10px",
  };

  

  return (
    <div style={bodyStyle}>
      <h1 style={fontStyle}>Main page</h1>
      <Link to="/gallery">게시판으로</Link>
      <br></br>
      <Link to="/signin" style={loginButtonStyle}>
        <button>로그인</button>
      </Link>
      <br />
      <Link to="/info" style={infoButtonStyle}>
        <button>회원정보</button>
      </Link>
      <br />
    </div>
  );
};

export default Main;
