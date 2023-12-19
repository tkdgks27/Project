import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const bodyStyle = {
  backgroundColor: "#17171e",
  paddingTop: 100,
  paddingBottom: 10,
  height: "100vh"
};

function LogOut() {
    const navigate =useNavigate();

    const handleClcik = () => {
      axios.get('api/users/logout').then((response) => {
      if (response.data.succes) {
        navigate("/");
      } else {
        alert("로그아웃에 실패했습니다.");
      }
      });
    }; 

  return (
    <div style={bodyStyle} onClick={handleClcik}>
        LogOut
    </div>
  );
};

export default LogOut;

