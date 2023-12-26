import axios from "axios";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Btn2 from "../design/Btn2";

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const isLoggedIn = () => {
    const token = sessionStorage.getItem("token");
    return !!token;
  };

  const showLoginAlert = () => {
    alert("로그인한 상태가 아닙니다. 로그인하세요.");
  };

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [admin, setAdmin] = useState("");
  const [num, setNum] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [birth, setBirth] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

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

  const memberInfo = new FormData();
  memberInfo.append("num", userData?.num || "");
  memberInfo.append("admin", userData?.admin || "");
  memberInfo.append("id", userData?.id || "");
  memberInfo.append("pw", userData?.pw || "");
  memberInfo.append("address", userData?.address || "");
  memberInfo.append("birth", userData?.birth || "");
  memberInfo.append("email", userData?.email || "");

  const userEmail = new FormData();
  userEmail.append("email", email);

  const startEditMode = () => {
    setEditMode(true);
  };
  const [editmode, setEditMode] = useState(false);

  const AddressFinder = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const newAddress = data.address;
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
    if (!pw && !email && !address) {
      alert("수정할 정보를 입력하세요");
      return;
    }
    const mergedAddress = `${address},${addressDetail}`;
    const updatedMemberInfo = new FormData();
    updatedMemberInfo.append("num", userData?.num || "");
    updatedMemberInfo.append("admin", userData?.admin || "");
    updatedMemberInfo.append("id", userData?.id || "");
    updatedMemberInfo.append("birth", userData?.birth || "");
    updatedMemberInfo.append("email", email || userData?.email); 
    updatedMemberInfo.append("address", address !== "" ? mergedAddress : userData?.address);
    updatedMemberInfo.append("pw", pw || userData?.pw); 

    axios
    .post("http://localhost:3001/member.update", updatedMemberInfo, {
      withCredentials: true,
      headers: {},
    })
    .then((res) => {
      console.log("업데이트 성공", res.data);
      sessionStorage.removeItem("token");
      alert("업데이트 성공, 다시 로그인해주세요");
      setEditMode(false);
      setUserData(res.data);
      navigate("/");
    })
    .catch((error) => {
      console.error("업데이트 오류: ", error);
      // alert("회원정보를 모두 입력해주세요.");
    });

    // memberInfo.delete("email");
    // memberInfo.delete("address");
    // memberInfo.delete("pw");

    // if (email) {
    //   memberInfo.append("email", email);
    // }
    // if (address) {
    //   memberInfo.append("address", mergedAddress);
    // }
    // if (pw) {
    //   memberInfo.append("pw", pw);
    // }

    axios
      .post("http://localhost:3001/member.update", memberInfo, {
        withCredentials: true,
        headers: {},
      })
      .then((res) => {
        console.log("업데이트 성공", res.data);
        sessionStorage.removeItem("token");
        alert("업데이트 성공, 다시 로그인해주세요");
        setEditMode(false);
        setUserData(res.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("업데이트 오류: ", error);
        alert("회원정보를 모두 입력해주세요.")
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
          alert("서버 오류 : " + error.response.status);
        } else if (error.request) {
          alert("서버 응답 오류");
        } else {
          alert("요청 전송 중 오류 발생");
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("아이디:", userData?.id || "");
    console.log("비밀번호:", userData?.pw || "");
    console.log("생년월일:", userData?.birth?.substring(0, 10) || "");
    console.log("이메일:", email);
    console.log("주소:", address);
  };

  const delInfo = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem(userData);

    axios
      .delete("http://localhost:3001/join.out", {
        params: { id: userData?.id || "" },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("회원 탈퇴 성공:", res.data);
        window.location.reload("/");
      })
      .catch((error) => {
        console.error("회원 탈퇴 오류:", error);
      });
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

  useEffect(() => {
    if (userData) {
      const memberInfo = new FormData();
      memberInfo.append("num", userData.num);
      memberInfo.append("admin", userData.admin);
      memberInfo.append("id", userData.id);
      memberInfo.append("pw", userData.pw);
      memberInfo.append("address", userData.address);
      memberInfo.append("birth", userData.birth);
      memberInfo.append("email", userData.email);
    }
  }, [userData]);

  const handlePasswordChange = (value) => {
    setPw(value);
    checkPasswordMatch(pw, value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    checkPasswordMatch(pw, value);
  };

  const checkPasswordMatch = (password, confirmPassword) => {
    const isMatch = password === confirmPassword;
    setIsPasswordMatch(isMatch);
  };

  const containerStyle = {
    backgroundColor: "#17171e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    paddingTop: 90,
    paddingBottom: 10,
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

  const confirmStyle = {
    marginTop: "-7px",
    marginLeft: "340px",
    cursor: "pointer",
    backgroundColor: "black",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "10px",
    whiteSpace: "nowrap",
  };

  const buttonContainerStyle = {
    display: "flex",
    alignItems: "center",
    width: "300px",
    marginTop: "10px",
    justifyContent: "space-evenly",
  };

  return (
    <div style={containerStyle}>
      {userData ? (
        <div>
          <form onSubmit={handleSubmit} style={formStyle}>
            <p>아이디: {userData.id}</p>
            <br />
            <label style={labelStyle}>
              <p>비밀번호: ******</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  name="pw"
                  type="password"
                  value={pw}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  style={getDynamicInputStyle()}
                  placeholder="새 비밀번호"
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
                  placeholder="비밀번호 확인"
                />
                {isPasswordMatch ? (
                  <span style={{ color: "green", marginLeft: "5px" }}>✔</span>
                ) : (
                  <span style={{ color: "red", marginLeft: "5px" }}>✘</span>
                )}
              </div>
            </label>
            {/* <input
              type="password"
              value={pw}
              style={inputStyle}
              onChange={(e) => {
              setPw(e.target.value);}}
              placeholder="새 비밀번호"
            />
            </label> */}
            <br />
            <p>생년월일: {userData.birth && userData.birth.substring(0, 10)}</p>
            <br />
            <label style={labelStyle}>
              <p>이메일: {userData.email}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  value={email}
                  style={inputStyle}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="새 이메일"
                />
                <button onClick={SendCode} style={buttonStyle}>
                  코드전송
                </button>
              </div>
            </label>

            <label style={labelStyle}>
              <p>인증코드:</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  name="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                  }}
                  style={inputStyle}
                  placeholder="인증코드"
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
            <label style={labelStyle}>
              <p>주소: {userData.address}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  name="address"
                  value={address}
                  style={inputStyle}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="새 주소"
                />
                <button style={buttonStyle} onClick={AddressFinder}>
                  주소찾기
                </button>
              </div>
            </label>
            <p>상세주소: {userData.addressDetail}</p>
            <input
              type="text"
              value={addressDetail}
              style={inputStyle}
              onChange={(e) => setAddressDetail(e.target.value)}
              placeholder="상세주소"
            />
            <br />
            <br />
            <br />
            <button style={confirmStyle} onClick={updateUserInfo}>
              수정 완료
            </button>
          </form>
        </div>
      ) : (
        <label style={labelStyle}>
          <div style={buttonContainerStyle}>
            <Link to={"/signin"}>
              <Btn2 classname={classNames("aa", "bb")}>로그인</Btn2>
            </Link>
            <Link to={"/"}>
              <Btn2 classNames={classNames("aa", "bb")}>홈으로</Btn2>
            </Link>
          </div>
        </label>
      )}
    </div>
  );
};

export default MyPage;
