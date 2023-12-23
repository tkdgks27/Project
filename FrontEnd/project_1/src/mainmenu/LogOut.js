import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const isLoggedIn = sessionStorage.getItem("token") && sessionStorage.getItem("userId");

  useEffect(() => {
    const performLogout = () => {
      if (isLoggedIn) {
        // 로그아웃 성공 여부를 판단하는 조건을 추가
        const logoutSuccessful = true;

        if (logoutSuccessful) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userId");

          // 성공 상태를 업데이트
          setLogoutSuccess(true);
        } else {
          // 로그아웃 실패 시 처리 로직을 추가
          console.error("로그아웃 실패");
        }
      } else {
        // 사용자가 로그인하지 않은 상태에서 로그아웃 시도
        console.error("로그인한 상태가 아닙니다. 로그인하세요.");

        // 로그인 페이지로 리디렉션
        navigate("/signin");
      }
    };

    // 로그아웃 실행
    performLogout();
  }, [navigate, isLoggedIn]);

  useEffect(() => {
    // logoutSuccess가 true일 때만 alert를 호출
    if (logoutSuccess) {
      // 로그아웃 성공 시 홈 페이지로 리디렉션
      navigate("/", { replace: true });

      // "로그아웃 성공" 팝업 알림
      alert("로그아웃 성공");
    } else if (!isLoggedIn) {
      // isLoggedIn이 false이고, 로그인 알림이 아직 미출력 상태일 때만 출력
      // "로그인한 상태가 아닙니다. 로그인하세요." 팝업 알림
      alert("로그인한 상태가 아닙니다. 로그인하세요.");
    }
  }, [logoutSuccess, isLoggedIn, navigate]);

  const bodyStyle = {
    backgroundColor: "#17171e",
    paddingTop: 100,
    paddingBottom: 10,
    height: "100vh"
  };

  return (
    <div style={bodyStyle}>
    </div>
  );
};

export default Logout;