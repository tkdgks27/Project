import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserInfo = () => {
  const [userData, setUserData] = useState(null);
  const token = sessionStorage.getItem("token");

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [admin, setAdmin] = useState("");
  const [num, setNum] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [birth, setBirth] = useState("");

  const memberInfo = new FormData();
  memberInfo.append("num", num);
  memberInfo.append("admin", admin);
  memberInfo.append("id", id);
  memberInfo.append("pw", pw);
  memberInfo.append("email", email);
  memberInfo.append("address", address);

  const userEmail = new FormData();
  userEmail.append("email", email);

  const startEditMode = () => {
    setEditMode(true);
  };
  const [editmode, setEditMode] = useState(false);

  // const splitAddress = userData.address.split(",");

  const AddressFinder = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const newAddress = data.address;
          console.log("New Address:", newAddress); // 추가
          setAddress(newAddress);
          setAddressDetail("");
          document.querySelector("input[name=address]").value = newAddress;
          document.querySelector("input[name=address]").readOnly = false;
        },
      }).open();
    } else {
      console.error(
        "Daum Postcode script not loaded or Postcode object not available"
      );
    }
  };

  const updateUserInfo = () => {
    const mergedAddress = `${address},${addressDetail}`;
    memberInfo.append("newEmail", email);
    memberInfo.append("newAddress", mergedAddress);
    memberInfo.append("newpw", pw);

    axios
      .post("http://localhost:3001/join.do", memberInfo, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("업데이트 성공", res.data);
        connectionCheck();
        setEditMode(false);
      })
      .catch((error) => {
        console.error("업데이트 오류: ", error);
      });
  };

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
        setUserData(res.data);
      })
      .catch((error) => {
        console.error("토큰 검증 중 오류 발생:", error);
      });
  };

  const SendCode = () => {
    if (!email) {
      alert("이메일을 입력하세요");
      return;
    }
    axios
      .post("http://localhost:3001/check.email", userEmail, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          alert("이메일 전송 성공");
        } else {
          alert("중복된 이메일입니다.");
        }
      })
      .catch((error) => {
        console.error("이메일 전송 요청 실패:", error);
        alert("서버 환경 불안정으로 잠시 후 다시 시도해주세요");
      });
  };

  const codeCheck = () => {
    if (!verificationCode) {
      alert("인증 코드를 입력하세요");
      return;
    }
    //코드 확인용 append 값
    const userCode = new FormData();
    userCode.append("verificationCode", verificationCode);

    axios
      .post("http://localhost:3001/check.code", userCode, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          alert("인증 성공!");
          alert(res.data);
        } else {
          alert("인증 코드가 일치하지 않습니다.");
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("아이디:", userData.id);
    console.log("비밀번호:", userData.pw);
    console.log("생년월일:", userData.birth);
    console.log("이메일:", userData.email);
    console.log("주소:", userData.address);
  };

  useEffect(() => {
    connectionCheck();

    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

    script.onload = () => {
      console.log("Daum PostCode script loaded");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
    marginTop: "-9px",
    marginLeft: "5px",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "10px",
    whiteSpace: "nowrap",
  };

  const confirmStyle = {
    marginTop: "-7px",
    marginLeft: "340px",
    cursor: "pointer",
    backgroundColor: "grey",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "10px",
    whiteSpace: "nowrap",
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

  const bodyStyle = {
    backgroundColor: "#17171e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    paddingTop: 70,
    paddingBottom: 0,
  };

  const homeStyle = {
    marginTop: "-7px",
    marginLeft: "340px",
    cursor: "pointer",
    backgroundColor: "grey",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "10px",
    whiteSpace: "nowrap",
  };

  return (
    <div style={containerStyle}>
      {userData ? (
        <div>
          <form onSubmit={handleSubmit} style={formStyle}>
            <p>아이디: {userData.id}</p>
            <br />
            <p>비밀번호: ****** </p>
            <input
              type="password"
              value={pw}
              style={inputStyle}
              onChange={(e) => {
              setPw(e.target.value);}}
              placeholder="새 비밀번호"
            />
            <br />
            <p>생년월일: {userData.birth}</p>
            <br />
            <label style={labelStyle}>
              <p>이메일: {userData.email}</p>
              <input
                type="text"
                value={email}
                style={inputStyle}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="새 이메일"
              />
            </label>
            <button onClick={SendCode} style={buttonStyle}>
              코드전송
            </button>
            <label style={labelStyle}>
              인증코드:
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  name="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                  }}
                  style={inputStyle}
                />
                <button
                  name="check.code"
                  type="button"
                  onClick={codeCheck}
                  style={buttonStyle}
                >
                  코드확인
                </button>
              </div>
            </label>
            <br />
            <label style={labelStyle}>
              <p>주소: {userData.address}</p>
              <input
                type="text"
                name="address"
                value={address}
                style={inputStyle}
                placeholder="새 주소"
              />
            </label>
            <button style={buttonStyle} onClick={AddressFinder}>
              주소찾기
            </button>
            <p>상세주소: {userData.addressDetail}</p>
            <input
              type="text"
              value={addressDetail}
              style={inputStyle}
              onChange={(e) => setAddressDetail(e.target.value)}
              placeholder="상세주소"
            />
            <Link to={"/"}>
              <button style={homeStyle}>홈으로</button>
            </Link>
            <button style={confirmStyle} onClick={updateUserInfo}>
              수정 완료
            </button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfo;
