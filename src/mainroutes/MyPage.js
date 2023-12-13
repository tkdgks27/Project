import React from 'react';
import { Link } from 'react-router-dom';

const MyPage = () => {
  const bodyStyle = {
    backgroundColor: "#17171e",
    margin: 0,
    padding: 0,
    height: "100vh",
  };

  const fontStyle = {
    color: "white",
  }
  
  return (
    <div style={bodyStyle}>
      <h1 style={fontStyle}>Main page</h1>
      <br/>
      <Link to="/gallery">게시판으로</Link>
      <br />
      <h1>우야라고</h1>
      <br />
    </div>
  );
};

export default MyPage;