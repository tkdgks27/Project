import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserInfo = () => {
  const [userData, setUserData] = useState(null);
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem('userId');
  // const headers = {
  //   Authorization: `Bearer ${token}`,
  // };
  const connectionCheck = () => {
    axios
      .post("http://localhost:3000/parse.JWT", { token }, {
        withCredentials: true,
        headers:{
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("토큰 검증 성공", token);
        setUserData({id: "", pw:"", email:"", birth: "", address: "", }); 
      })
      .catch((error) => {
        console.error('토큰 검증 중 오류 발생:', error);
        alert(userId);
        alert(token);
      });
  };

  useEffect(() => {
    connectionCheck();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const containerStyle = {
    backgroundColor: '#17171e',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  };

  return (
    <div style={containerStyle}>
      <button onClick={connectionCheck}>aaa</button>
      {userData ? (
        <>
          <p>아이디: {userData.id}</p>
          <p>이름: {userData.name}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfo;
