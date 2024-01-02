import React, { useEffect } from 'react'
import axios from 'axios';
import { useHistory, useNavigate } from 'react-router-dom'

// ID : NCXl7jpKm7KDwpD6yaB7
// PW : sJkLB_NdUS


const Naverlogin = () => {

  
  const redirectUri = 'http://localhost:3000';
  
  const navigate = useNavigate();
  
  const handleNaverLogin = () => {
    
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;
  };
  
  
  const handleNaverCallback = () => {
    // 현재 URL에서 fragment identifier 추출
    const fragment = window.location.hash.substring(1);
  
    // fragment를 파싱하여 객체로 변환
    const params = new URLSearchParams(fragment);
  
    // access_token 가져오기
    const accessToken = params.get("access_token");
  
    // access_token이 존재하면 사용자 정보를 가져오고 메인 페이지로 이동
    if (accessToken) {
      axios
        .get("https://openapi.naver.com/v1/nid/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          alert("로그인 성공");
          // 여기서 e.preventDefault(); 제거
          navigate("/", { replace: true });
        })
        .catch((error) => {
          console.error("네이버 API에서 사용자 정보를 가져오는 중 오류 발생:", error);
        });
    } else {
      alert("Access Token이 없습니다.");
    }
  };
  
  

    return (
      <div>
      <button onClick={handleNaverLogin}>네이버 로그인</button>
    </div>
  );
};

export default Naverlogin;

