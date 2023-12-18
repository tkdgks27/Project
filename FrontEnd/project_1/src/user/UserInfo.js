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
      .post("http://localhost:3001/parse.JWT", { token }, {
        withCredentials: true,
        headers:{
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("토큰 검증 성공", token);
        setUserData({id: "", pw:"", email:"", birth: "", address: "", });
        alert(userData); 
      })
      .catch((error) => {
        console.error('토큰 검증 중 오류 발생:', error);
        // alert(userId);
        // alert(token);
      });
  };

  useEffect(() => {
    connectionCheck();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

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
      {/* <button onClick={connectionCheck}>aaa</button> */}
      {userData ? (
        <>
        <form style={formStyle}>
          <p>아이디: {userData.id}</p>
          <br />
          <p>이름: {token.name}</p>
          <br />
          <p>이메일: {token.email}</p>
          <br />
        </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfo;
