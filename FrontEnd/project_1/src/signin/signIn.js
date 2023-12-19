import classNames from "classnames";
import React, { useEffect, useState } from "react";
import "./signin.css";
import Useraccount from "../user/useraccount";
import Button from "../design/Button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Btn2 from "../design/Btn2";
import axios from "axios";

const SignIn = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const validationCheck = new FormData();
  validationCheck.append("id", id);
  validationCheck.append("pw", pw);


  
  useEffect(() => {
    document.title = "로그인";
  }, []);

  const clientId = "NCXl7jpKm7KDwpD6yaB7";
  const redirectUri = "http://localhost:3000/main";

  const handleNaverLogin = () => {
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;
  };

  const handleNaverCallback = () => {
    const accessToken = window.location.hash.split("&")[0].split("=")[1];

    axios
      .get("https://openapi.naver.com/v1/nid/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user info from Naver API:", error);
      });
  };

  // const [loginSuccess, setLoginSuccess] = useState(false);
  // const [loginFailed, setLoginFailed] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (!id || !pw) {
      alert("아이디, 비밀번호를 모두 입력해주세요");
      return;
    }
    axios
      .post("http://localhost:3001/login.do", validationCheck, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          // sessionStorage.setItem("t", res.data);
          alert("로그인 성공");
          navigate("/");
        } else {
          alert("로그인 실패");
        }
      })
      .catch((error) => {
        console.error("인증 확인 요청 실패:", error);

        if (error.response) {
          // 서버 응답 왔을때
          alert("서버 오류 : " + error.response.status);
        } else if (error.request) {
          //요청은 가는데 응답이 안올때
          alert("서버 응답 오류");
        } else {
          // 요청 전송전에 에러발생
          alert("요청 전송 중 오류 발생");
        }
      });
      // alert(validationCheck);
      // navigate("/");
    };
    // useEffect(() => {
    //   if (loginSuccess) {
    //     navigate("/");
    //   // } else {
    //   //  navigate("/");
    //   }

    // }, [loginSuccess,navigate]);

  const bodyStyle = {
    backgroundColor: "#17171e",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    paddingTop: 30,
    paddingBottom: 10,
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const inputStyle = {
    width: "300px",
    padding: "10px",
    marginBottom: "10px",
    border: "2px solid #fff",
    borderRadius: "5px",
    backgroundColor: "#1f1f2e",
    color: "#fff",
    outline: "none",
  };

  const buttonContainerStyle = {
    display: "flex",
    alignItems: "center",
    width: "300px",
    marginTop: "10px",
    justifyContent: "space-evenly",
  };

  const findPasswordStyle = {
    color: "white",
    fontSize: "12px",
    marginTop: "5px",
  };

  return (
    <div style={bodyStyle}>
      <form style={formStyle}>
        <input
          name="id"
          type="text"
          value={id}
          className="cc"
          style={inputStyle}
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디"
        />
        <br />
        <input
          name="pw"
          type="password"
          value={pw}
          className="cc"
          style={inputStyle}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호"
        />
        <br />
        <div style={buttonContainerStyle}>
          <Btn2 className={classNames("aa", "bb")} onClick={handleClick}>
            로그인
          </Btn2>
          <Link to="/user">
            <Btn2
              className={classNames("aa", "bb")}
              style={{ display: "none" }}
            >
              회원가입
            </Btn2>
          </Link>
        </div>
        <div style={findPasswordStyle}>
          <Link to="/find">아이디/비밀번호 찾기</Link>
        </div>
      </form>
      <br />
      {/*
      {loginSuccess && (
        <Link to="/main">
          <Button>로그인 성공! Main 페이지로 이동</Button>
        </Link>
      )}
      {loginFailed && alert("로그인 실패")}
      {!loginSuccess && !loginFailed && (
        {/*
        <img
        src="../navertbtn.png"
        alt="NaverButton"
        style={{ cursor: "pointer" }}
        onClick={() => window.location.assign("/naverlogin")}
      )}
      />*/}
      <Link to="/naverlogin">
        <Button onClick={handleNaverLogin}>네이버 로그인</Button>
      </Link>
    </div>
  );
};

export default SignIn;
