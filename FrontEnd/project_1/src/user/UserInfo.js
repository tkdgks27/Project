import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserInfo = () => {
  const [userData, setUserData] = useState(null);
  const token = sessionStorage.getItem("token");
  // const userId = sessionStorage.getItem('userId');
  // const headers = {
  //   Authorization: `Bearer ${token}`,
  // };

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");


  const connectionCheck = () => {
    const memberInfo = {
      id: id,
      pw: pw,
      email: email,
      address: address,
    } ;
    // new FormData();
    // memberInfo.append("id", id);
    // memberInfo.append("pw", pw);
    // memberInfo.append("email", email);
    // memberInfo.append("address", address);
    
    axios
      .post("http://localhost:3001/parse.JWT", memberInfo, {
        withCredentials: true,
        headers:{
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("토큰 검증 성공", memberInfo);
        setUserData(memberInfo);
        // alert(userData); 
        // // alert(userId);
        // alert(token);
        // alert(res);
      })
      .catch((error) => {
        console.error('토큰 검증 중 오류 발생:', error);
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
          <p>비밀번호: {userData.pw}</p>
          <br />
          <p>이메일: {userData.email}</p>
          <br />
          <p>주소: {userData.address}</p>
        </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfo;
