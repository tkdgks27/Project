import axios from "axios";
import React, { useEffect, useState } from "react";
import Btn3 from "../design/Btn3";

const Useraccount = () => {
  const [account, setAccount] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [birth, setBirth] = useState("");
  const [email, setEmail] = useState("");
  const [sentCode, setSentCode] = useState("");

  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  // 버튼 입력 체크 함수
  const [IdChecked, setIdChecked] = useState(false);
  const [EmailChecked, setEmailChecked] = useState(false);
  const [CodeChecked, setCodeChecked] = useState(false);
    
    
    
  useEffect(() => {
      document.title = "회원가입";
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
  
  // id 중복확인 append 값
  const idd = new FormData();
  idd.append("id", id);

  // const [addressMerge, setAddressMerge] = useState({
  //   address: "",
  //   addressDetail: "",
  // });
  
  const mergedAddress = `${address}, ${addressDetail}`;
  // 회원가입 append 값
  const member = new FormData();
  member.append("id", id);
  member.append("pw", pw);
  member.append("email", email);
  member.append("birth", birth);
  member.append("address", mergedAddress);
  // member.append("address", address);
  // member.append("addressDetail", addressDetail);


  
  //email 중복확인 append 값
  const userEmail = new FormData();
  userEmail.append("email", email);
  
  const handleSignUp = () => {
    if (
      !id ||
      !pw ||
      !confirmPassword ||
      !birth ||
      !email ||
      !address ||
      !addressDetail
      ) {
        alert("모든 항목을 채워주세요.");
        return;
      }
      
      if (pw !== confirmPassword) {
        alert("비밀번호 확인이 일치하지 않습니다.");
        return;
      }
      // 버튼 눌렀는지 체크
      if (!IdChecked || !EmailChecked || !CodeChecked) {
        alert("확인 버튼을 모두 눌러 확인 후 가입해주세요.");
        return;
      }

    axios
    .post("http://localhost:3001/join.do", member, {
      withCredentials: true,
    })
    .then((res) => {
      sessionStorage.setItem("t", res.data);
      alert("회원가입 성공");
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("회원 가입 요청 실패:", error);
      alert("서버 연결 불안정으로 잠시 후 다시 시도해주세요");
    });
  };
  
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
  
  const idCheck = () => {
    if (!id) {
      alert("아이디를 입력하세요");
      return;
    }
    axios
    .post("http://localhost:3001/check.id", idd, {
      withCredentials: true,
    })
    .then((res) => {
      if (res.data) {
        alert("사용 가능한 아이디 입니다.");
      } else {
        alert("사용중인 아이디 입니다.");
      }
    })
    .catch((error) => {
      console.error("중복 확인 요청 실패: ", error);
      alert("서버 환경 불안정으로 잠시 후 다시 시도해주세요");
    });
    setIdChecked(true);
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
    setEmailChecked(true);
  };
  
  const AddressFinder = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          setAddress(data.address);
          document.querySelector("input[name=address]").focus();
          document.querySelector("input[name=address]").readOnly = true;
        },
      }).open();
    }
  };
  const [verificationCode, setVerificationCode] = useState("");
  
  
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
      setCodeChecked(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("아이디:", id);
    console.log("비밀번호:", pw);
    console.log("비밀번호 확인:", confirmPassword);
    console.log("생년월일:", birth);
    console.log("이메일:", email);
    console.log("주소:", address);
    console.log("상세주소:", addressDetail);
  };

  const containerStyle = {
    backgroundColor: "#17171e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    paddingTop: 90,
    paddingBottom: 50,
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
              value={id}
              onChange={(e) => setId(e.target.value)}
              style={inputStyle}
            />
            <button
              name="check.id"
              type="button"
              onClick={idCheck}
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
              value={pw}
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
            type="date"
            value={birth}
            placeholder="YYYY-MM-DD"
            onChange={(e) => setBirth(e.target.value)}
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
            <button onClick={SendCode} style={buttonStyle}>
              코드전송
            </button>
          </div>
        </label>

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

        <label style={labelStyle}>
          주소:
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              name="address"
              type="address"
              value={address}
              style={inputStyle}
            />
            <button style={buttonStyle} onClick={AddressFinder}>
              주소찾기
            </button>
          </div>
        </label>

        <label style={labelStyle}>
          상세주소:
          <input
            name="addressDetail"
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