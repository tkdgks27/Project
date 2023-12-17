import React, { useEffect } from 'react'

const UserInfo = () => {

    useEffect(() => {
        document.title = "회원정보 확인";
    });

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
        
    </div>
  )
}

export default UserInfo;