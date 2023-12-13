import axios from "axios";
import React, { useEffect, useState } from "react";
import Btn3 from "../design/Btn3";

const Useraccount = () => {
  const [account, setAccount] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  useEffect(() => {
    document.title = "회원가입";
  });

  const handleSignUp = () => {
    if (!userId || !password || !confirmPassword || !birthdate || !email || !address || !addressDetail) {
      alert("모든 항목을 채워주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    axios
      .post("http://localhost:3000/join.do", {
        name: userId,
        pw: password,
        email: email,
        address: address,
        addressDetail: addressDetail,
        "check.code": code,
        birth: birthdate,
      })
      .then((res) => {
        sessionStorage.setItem("t", res.data);
        setAccount({
          name: "",
          pw: "",
          email: "",
          address: "",
          addressDetail: "",
          birth: "",
        });
        alert("회원가입 성공");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("회원 가입 요청 실패:", error);
        alert("서버 연결 불안정으로 잠시 후 다시 시도해주세요");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("아이디:", userId);
    console.log("비밀번호:", password);
    console.log("비밀번호 확인:", confirmPassword);
    console.log("생년월일:", birthdate);
    console.log("이메일:", email);
    console.log("주소:", address);
    console.log("상세주소:", addressDetail);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    checkPasswordMatch(password, value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    checkPasswordMatch(password, value);
  };

  const checkPasswordMatch = (password, confirmPassword) => {
    const isMatch = password === confirmPassword;
    setIsPasswordMatch(isMatch);
  };

  const handleCheckDuplicate = () => {
    // 아이디 중복 확인 필요
    console.log("중복 확인 버튼 클릭");
  };

  const containerStyle = {
    backgroundColor: "#17171e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  };

  const formStyle = {
    width: "400px",
    padding: "20px",
    border: "2px solid #fff",
    borderRadius: "10px",
    backgroundColor: "#1f1f2e",
    color: "#fff",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  };

  const getDynamicInputStyle = () => {
    return {
      width: "300px",
      padding: "10px",
      marginBottom: "10px",
      border: "2px solid #fff",
      borderRadius: "5px",
      backgroundColor: "#1f1f2e",
      color: "#fff",
      outline: "none",
    };
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

  const buttonStyle = {
    marginTop: "-7px",
    marginLeft: "15px",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "10px",
    whiteSpace: "nowrap",
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          아이디:
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="id"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={inputStyle}
            />
            <button
              name="check.id"
              type="button"
              onClick={handleCheckDuplicate}
              style={buttonStyle}
            >
              중복확인
            </button>
          </div>
        </label>

        <label style={labelStyle}>
          비밀번호:
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="pw"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              style={getDynamicInputStyle()}
            />
          </div>
        </label>

        <label style={labelStyle}>
          비밀번호 확인:
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              style={getDynamicInputStyle()}
            />
            {isPasswordMatch ? (
              <span style={{ color: "green", marginLeft: "5px" }}>✔</span>
            ) : (
              <span style={{ color: "red", marginLeft: "5px" }}>✘</span>
            )}
          </div>
        </label>

        <label style={labelStyle}>
          생년월일:
          <input
            name="birth"
            type="text"
            value={birthdate}
            placeholder="YYYY-MM-DD"
            onChange={(e) => setBirthdate(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          이메일:
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <button style={buttonStyle}>코드전송</button>
          </div>
        </label>

        <label style={labelStyle}>
          인증코드:
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="check.code"
              type="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={inputStyle}
            />
            <button style={buttonStyle}>코드확인</button>
          </div>
        </label>

        <label style={labelStyle}>
          주소:
          <input
            name="address1"
            type="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          상세주소:
          <input
            name="address2"
            type="address"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            style={inputStyle}
          />
        </label>

        <Btn3 onClick={handleSignUp}>가입하기</Btn3>
      </form>
    </div>
  );
};

export default Useraccount;
