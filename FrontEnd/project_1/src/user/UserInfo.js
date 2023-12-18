import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserInfo = () => {
  const [userData, setUserData] = useState(null);
  const token = sessionStorage.getItem("token");

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [admin, setAdmin] = useState("");


  const connectionCheck = () => {
    const memberInfo = new FormData();
    memberInfo.append("admin", admin);
    memberInfo.append("id", id);
    memberInfo.append("pw", pw);
    memberInfo.append("email", email);
    memberInfo.append("address", address);
    // const memberInfo = {
    //   id: id,
    //   pw: pw,
    //   email: email,
    //   address: address,
    // } ;
    // memberInfo.append("admin", admin);

    
    axios
      .post("http://localhost:3001/parse.JWT", memberInfo, {
        withCredentials: true,
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        // payloads:{
        // }
      })
      .then((res) => {
        console.log("토큰 검증 성공", res.data);
        alert(memberInfo.get(admin));
        // alert(res.data.id);
        // alert(res.data.pw);
        // alert(res.data.email);
        // alert(res.data.address);

      })
      .catch((error) => {
        console.error('토큰 검증 중 오류 발생:', error);
        // alert(setUserData(id));
        // alert(setUserData(pw));
        // alert(setUserData(email));
        // alert(setUserData(address));
        // alert(sessionStorage.getItem("token"));
        // alert(setUserData);
        // alert(memberInfo);
      });
    };

    
    useEffect(() => {
      connectionCheck();
    }, []);
    
    // const showInfo = () => {
    //   axios.post("http://localhost:3001/parse.JWT", {token: token},{
    //     withCredentials:true,
    //     headers:{
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     alert(JSON.stringify(res.data))
    //   }) 
    // }
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
      <button onClick={connectionCheck}>aaa</button>
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
